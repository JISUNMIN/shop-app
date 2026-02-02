import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ errorKey: "auth.serverError.unauthorized" }, { status: 401 });
    }

    await prisma.userCoupon.updateMany({
      where: {
        userId,
        status: "AVAILABLE",
        expiresAt: {
          lt: new Date(),
        },
      },
      data: {
        status: "EXPIRED",
      },
    });

    const coupons = await prisma.userCoupon.findMany({
      where: { userId },
      orderBy: { issuedAt: "desc" },
      select: {
        id: true,
        status: true,
        issuedAt: true,
        expiresAt: true,
        usedAt: true,
        orderId: true,
        couponId: true,
        coupon: {
          select: {
            id: true,
            code: true,
            name: true,
            discountType: true,
            discountValue: true,
            isActive: true,
            minOrderAmount: true,
          },
        },
      },
    });

    return NextResponse.json(coupons);
  } catch {
    return NextResponse.json({ error: "Failed to fetch coupon" }, { status: 500 });
  }
}
