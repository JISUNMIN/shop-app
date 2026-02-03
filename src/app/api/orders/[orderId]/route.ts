import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = Number(params.orderId);
    if (!Number.isFinite(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: { userId, id: orderId },
      select: {
        id: true,
        status: true,

        totalAmount: true,
        discountAmount: true,

        createdAt: true,

        carrier: true,
        trackingNumber: true,

        shipName: true,
        shipPhone: true,
        shipZip: true,
        shipAddress1: true,
        shipAddress2: true,
        shipMemo: true,

        orderItems: {
          select: {
            id: true,
            quantity: true,
            price: true,

            product: {
              select: {
                name: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch order", detail: String(e) },
      { status: 500 },
    );
  }
}
