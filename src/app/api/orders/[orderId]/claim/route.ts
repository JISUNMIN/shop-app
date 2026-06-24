import { auth } from "@/auth";
import { appendOrderEvent } from "@/lib/orderEvents";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import type { OrderEventType, OrderStatus } from "@/types";

const CANCELABLE_STATUSES = new Set(["PENDING", "PAID"]);
const RETURNABLE_STATUSES = new Set(["DELIVERED"]);

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { orderId: id } = await context.params;
    const { cancelReason, cancelMemo, returnReason, returnMemo } = body;

    const orderId = typeof id === "string" ? Number(id) : id;

    if (!orderId || Number.isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }

    const existing = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, userId: true, status: true },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const hasCancelPayload = typeof cancelReason === "string" || typeof cancelMemo === "string";
    const hasReturnPayload = typeof returnReason === "string" || typeof returnMemo === "string";

    if (!hasCancelPayload && !hasReturnPayload) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    if (hasCancelPayload && hasReturnPayload) {
      return NextResponse.json({ error: "Choose either cancel or return" }, { status: 400 });
    }

    const data: Prisma.OrderUpdateInput = {};

    if (hasCancelPayload) {
      if (!CANCELABLE_STATUSES.has(existing.status)) {
        return NextResponse.json({ error: "Order cannot be canceled" }, { status: 409 });
      }

      if (typeof cancelReason === "string") data.cancelReason = cancelReason;
      if (typeof cancelMemo === "string") data.cancelMemo = cancelMemo;
      data.cancelRequestedAt = new Date();
      data.status = "CANCEL_REQUESTED";
    }

    if (hasReturnPayload) {
      if (!RETURNABLE_STATUSES.has(existing.status)) {
        return NextResponse.json({ error: "Order cannot be returned" }, { status: 409 });
      }

      if (typeof returnReason === "string") data.returnReason = returnReason;
      if (typeof returnMemo === "string") data.returnMemo = returnMemo;
      data.returnRequestedAt = new Date();
      data.status = "RETURN_REQUESTED";
    }

    const claim = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId },
        data,
      });

      await appendOrderEvent(tx, {
        orderId,
        eventType: (hasCancelPayload
          ? "CANCEL_REQUESTED"
          : "RETURN_REQUESTED") as OrderEventType,
        fromStatus: existing.status as OrderStatus,
        toStatus: updated.status as OrderStatus,
        note: hasCancelPayload ? cancelReason ?? cancelMemo : returnReason ?? returnMemo,
      });

      return updated;
    });

    return NextResponse.json(claim);
  } catch (error) {
    console.error("ORDER CLAIM ERROR:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
