import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const id = params.orderId;
    const { cancelReason, cancelMemo, returnReason, returnMemo } = body;

    const orderId = typeof id === "string" ? Number(id) : id;

    if (!orderId || Number.isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }

    const existing = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, userId: true },
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

    const data: Record<string, any> = {};

    if (hasCancelPayload) {
      if (typeof cancelReason === "string") data.cancelReason = cancelReason;
      if (typeof cancelMemo === "string") data.cancelMemo = cancelMemo;
      data.cancelRequestedAt = new Date();
      data.status = "CANCEL_REQUESTED";
    }

    if (hasReturnPayload) {
      if (typeof returnReason === "string") data.returnReason = returnReason;
      if (typeof returnMemo === "string") data.returnMemo = returnMemo;
      data.returnRequestedAt = new Date();
      data.status = "REFUNDED";
    }

    const claim = await prisma.order.update({
      where: { id: orderId },
      data,
    });

    return NextResponse.json(claim);
  } catch (error) {
    console.error("ORDER CLAIM ERROR:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
