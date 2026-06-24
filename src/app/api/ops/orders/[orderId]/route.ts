import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { appendOrderEvent } from "@/lib/orderEvents";
import { getOperatorSession } from "@/lib/operatorAuth";
import {
  buildShippingUpdateNote,
  buildTransitionData,
  getOrderEventTypeForStatus,
  validateOrderPatchInput,
} from "@/lib/orderOperations";
import type { OrderEventType, OrderPriority, OrderStatus } from "@/types";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    const operator = await getOperatorSession();
    if (!operator.ok) {
      return NextResponse.json({ error: operator.message }, { status: operator.status });
    }

    const { orderId: rawOrderId } = await context.params;
    const orderId = Number(rawOrderId);

    if (!Number.isFinite(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = await (prisma.order.findUnique as (...args: unknown[]) => Promise<unknown>)({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        discountAmount: true,
        paymentMethod: true,
        carrier: true,
        trackingNumber: true,
        assignedOperator: true,
        priority: true,
        slaDueAt: true,
        internalMemo: true,
        createdAt: true,
        updatedAt: true,
        paidAt: true,
        deliveredAt: true,
        refundedAt: true,
        returnedAt: true,
        cancelRequestedAt: true,
        returnRequestedAt: true,
        shipName: true,
        shipPhone: true,
        shipZip: true,
        shipAddress1: true,
        shipAddress2: true,
        shipMemo: true,
        cancelReason: true,
        cancelMemo: true,
        returnReason: true,
        returnMemo: true,
        user: {
          select: {
            id: true,
            name: true,
            userId: true,
            phone: true,
            email: true,
          },
        },
        orderItems: {
          select: {
            id: true,
            orderId: true,
            productId: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                stock: true,
              },
            },
          },
        },
        orderEvents: {
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          select: {
            id: true,
            orderId: true,
            eventType: true,
            fromStatus: true,
            toStatus: true,
            note: true,
            createdAt: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(order)));
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch operator order detail", detail: String(error) },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    const operator = await getOperatorSession();
    if (!operator.ok) {
      return NextResponse.json({ error: operator.message }, { status: operator.status });
    }

    const { orderId: rawOrderId } = await context.params;
    const orderId = Number(rawOrderId);

    if (!Number.isFinite(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const body = await request.json();
    const nextStatus = body?.nextStatus as OrderStatus | undefined;
    const carrier = typeof body?.carrier === "string" ? body.carrier.trim() : undefined;
    const trackingNumber =
      typeof body?.trackingNumber === "string" ? body.trackingNumber.trim() : undefined;
    const note = typeof body?.note === "string" ? body.note.trim() : undefined;
    const assignedOperator =
      typeof body?.assignedOperator === "string" ? body.assignedOperator.trim() : undefined;
    const priority = typeof body?.priority === "string" ? (body.priority as OrderPriority) : undefined;
    const slaDueAtRaw = typeof body?.slaDueAt === "string" ? body.slaDueAt.trim() : undefined;
    const internalMemo =
      typeof body?.internalMemo === "string" ? body.internalMemo.trim() : undefined;
    const slaDueAt =
      slaDueAtRaw === undefined
        ? undefined
        : slaDueAtRaw
          ? new Date(slaDueAtRaw)
          : null;

    const hasShippingUpdate = carrier !== undefined || trackingNumber !== undefined;
    const hasOpsMetadataUpdate =
      assignedOperator !== undefined ||
      priority !== undefined ||
      slaDueAt !== undefined ||
      internalMemo !== undefined;
    if (!nextStatus && !hasShippingUpdate && !hasOpsMetadataUpdate) {
      return NextResponse.json({ error: "Missing patch payload" }, { status: 400 });
    }

    const existing = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        carrier: true,
        trackingNumber: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const validationError = validateOrderPatchInput({
      currentStatus: existing.status as OrderStatus,
      nextStatus,
      currentCarrier: existing.carrier,
      currentTrackingNumber: existing.trackingNumber,
      carrier: carrier !== undefined ? carrier || null : undefined,
      trackingNumber: trackingNumber !== undefined ? trackingNumber || null : undefined,
      note: note || null,
    });

    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: validationError === "Invalid status transition" ? 409 : 400 },
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const patchData: Prisma.OrderUpdateInput = {
        ...(nextStatus ? buildTransitionData(nextStatus, new Date()) : {}),
        ...(carrier !== undefined ? { carrier: carrier || null } : {}),
        ...(trackingNumber !== undefined ? { trackingNumber: trackingNumber || null } : {}),
        ...(assignedOperator !== undefined ? { assignedOperator: assignedOperator || null } : {}),
        ...(priority !== undefined ? { priority } : {}),
        ...(slaDueAt !== undefined ? { slaDueAt } : {}),
        ...(internalMemo !== undefined ? { internalMemo: internalMemo || null } : {}),
      };

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: patchData,
      });

      if (nextStatus) {
        await appendOrderEvent(tx, {
          orderId,
          eventType: getOrderEventTypeForStatus(nextStatus),
          fromStatus: existing.status as OrderStatus,
          toStatus: nextStatus,
          note: note || null,
        });
      }

      if (hasShippingUpdate) {
        await appendOrderEvent(tx, {
          orderId,
          eventType: "STATUS_CHANGED" as OrderEventType,
          fromStatus: updatedOrder.status as OrderStatus,
          toStatus: updatedOrder.status as OrderStatus,
          note: buildShippingUpdateNote({
            carrier: carrier || null,
            trackingNumber: trackingNumber || null,
            fallbackCarrier: updatedOrder.carrier,
            fallbackTrackingNumber: updatedOrder.trackingNumber,
          }),
        });
      }

      if (hasOpsMetadataUpdate) {
        const opsNoteParts = [
          assignedOperator !== undefined
            ? `assignee=${assignedOperator || "-"}`
            : null,
          priority !== undefined ? `priority=${priority}` : null,
          slaDueAt !== undefined ? `sla=${slaDueAt ? slaDueAt.toISOString() : "-"}` : null,
          internalMemo !== undefined ? `memo=${internalMemo || "-"}` : null,
        ].filter(Boolean);

        await appendOrderEvent(tx, {
          orderId,
          eventType: "STATUS_CHANGED" as OrderEventType,
          fromStatus: updatedOrder.status as OrderStatus,
          toStatus: updatedOrder.status as OrderStatus,
          note: `Ops metadata updated: ${opsNoteParts.join(", ")}`,
        });
      }

      return updatedOrder;
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update operator order", detail: String(error) },
      { status: 500 },
    );
  }
}
