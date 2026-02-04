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

      couponId, // userCouponId
      discountAmount,
    } = body;

    const now = new Date();

    const order = await prisma.$transaction(async (tx) => {
      const userCoupon = couponId
        ? await tx.userCoupon.findFirst({
            where: { id: couponId, userId },
            select: {
              id: true,
              couponId: true, // 살제 Coupon.id
              status: true,
              expiresAt: true,
            },
          })
        : null;

      if (couponId && !userCoupon) throw new Error("COUPON_NOT_FOUND");
      if (userCoupon) {
        if (userCoupon.status !== "AVAILABLE") throw new Error("COUPON_NOT_AVAILABLE");
        if (userCoupon.expiresAt < now) throw new Error("COUPON_EXPIRED");
      }

      const created = await tx.order.create({
        data: {
          userId,

          totalAmount,
          discountAmount: discountAmount ?? 0,

          status: "PAID",
          paidAt: now,

          couponId: userCoupon ? userCoupon.couponId : null,

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
      });

      if (userCoupon) {
        await tx.userCoupon.update({
          where: { id: userCoupon.id },
          data: {
            status: "USED",
            usedAt: now,
            orderId: created.id,
          },
        });
      }

      return created;
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("ORDER CREATE ERROR:", error);

    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
