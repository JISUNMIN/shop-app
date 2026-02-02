import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ errorKey: "auth.serverError.unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        discountAmount: true,
        shipName: true,
        shipMemo: true,
        createdAt: true,
        orderItems: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ errorKey: "auth.serverError.unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      shipName,
      shipPhone,
      shipZip,
      shipAddress1,
      shipAddress2,
      shipMemo,

      products,
      totalAmount,

      couponId,
      discountAmount,
    } = body;

    if (!products || products.length === 0) {
      return NextResponse.json({ error: "No products provided" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId,

        totalAmount,
        discountAmount: discountAmount ?? 0,

        status: "PAID",
        paidAt: new Date(),

        couponId: couponId ?? null,

        shipName,
        shipPhone,
        shipZip,
        shipAddress1,
        shipAddress2,
        shipMemo,

        orderItems: {
          create: products.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },

      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("ORDER CREATE ERROR:", error);

    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
