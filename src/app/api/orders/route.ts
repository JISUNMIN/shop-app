import { auth } from "@/auth";
import { appendOrderEvent } from "@/lib/orderEvents";
import { prisma } from "@/lib/prisma";
import { PaymentMethod } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import type { OrderEventType, OrderStatus } from "@/types";

const PAYMENT_METHODS = new Set<PaymentMethod>(["BANK", "KAKAO", "NAVER", "CARD"]);

function getCouponDiscountAmount(
  subtotal: number,
  coupon: {
    discountType: "PERCENT" | "AMOUNT";
    discountValue: number;
    minOrderAmount: number | null;
    maxDiscountAmount: number | null;
  },
) {
  if (coupon.minOrderAmount != null && subtotal < coupon.minOrderAmount) {
    throw new Error("COUPON_MIN_ORDER_AMOUNT");
  }

  const rawDiscount =
    coupon.discountType === "PERCENT"
      ? Math.floor((subtotal * coupon.discountValue) / 100)
      : coupon.discountValue;

  if (coupon.maxDiscountAmount != null) {
    return Math.min(rawDiscount, coupon.maxDiscountAmount);
  }

  return rawDiscount;
}

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
        carrier: true,
        trackingNumber: true,
        paymentMethod: true,
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
        orderEvents: {
          take: 4,
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

    return NextResponse.json(orders);
  } catch {
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
      couponId, // userCouponId
      paymentMethod,
    } = body;

    const now = new Date();
    const normalizedPaymentMethod =
      typeof paymentMethod === "string" && PAYMENT_METHODS.has(paymentMethod as PaymentMethod)
        ? (paymentMethod as PaymentMethod)
        : null;

    if (!normalizedPaymentMethod) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "No products to order" }, { status: 400 });
    }

    const order = await prisma.$transaction(async (tx) => {
      const quantityByProductId = new Map<number, number>();

      for (const item of products) {
        const productId = Number(item?.productId);
        const quantity = Number(item?.quantity);

        if (!Number.isInteger(productId) || productId <= 0) {
          throw new Error("INVALID_PRODUCT_ID");
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
          throw new Error("INVALID_QUANTITY");
        }

        quantityByProductId.set(productId, (quantityByProductId.get(productId) ?? 0) + quantity);
      }

      const productIds = Array.from(quantityByProductId.keys());
      const dbProducts = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, price: true, stock: true },
      });

      if (dbProducts.length !== productIds.length) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const productMap = new Map(dbProducts.map((product) => [product.id, product]));
      const normalizedProducts = productIds.map((productId) => {
        const product = productMap.get(productId);
        const quantity = quantityByProductId.get(productId) ?? 0;

        if (!product) {
          throw new Error("PRODUCT_NOT_FOUND");
        }

        if (quantity > product.stock) {
          throw new Error("OUT_OF_STOCK");
        }

        return {
          productId,
          quantity,
          price: product.price,
        };
      });

      const subtotal = normalizedProducts.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const userCoupon = couponId
        ? await tx.userCoupon.findFirst({
            where: { id: couponId, userId },
            select: {
              id: true,
              couponId: true, // 살제 Coupon.id
              status: true,
              expiresAt: true,
              coupon: {
                select: {
                  discountType: true,
                  discountValue: true,
                  minOrderAmount: true,
                  maxDiscountAmount: true,
                  startsAt: true,
                  endsAt: true,
                  isActive: true,
                },
              },
            },
          })
        : null;

      if (couponId && !userCoupon) throw new Error("COUPON_NOT_FOUND");
      if (userCoupon) {
        if (userCoupon.status !== "AVAILABLE") throw new Error("COUPON_NOT_AVAILABLE");
        if (userCoupon.expiresAt < now) throw new Error("COUPON_EXPIRED");
        if (!userCoupon.coupon.isActive) throw new Error("COUPON_INACTIVE");
        if (userCoupon.coupon.startsAt && userCoupon.coupon.startsAt > now) {
          throw new Error("COUPON_NOT_STARTED");
        }
        if (userCoupon.coupon.endsAt && userCoupon.coupon.endsAt < now) {
          throw new Error("COUPON_ENDED");
        }
      }

      const discountAmount = userCoupon
        ? getCouponDiscountAmount(subtotal, userCoupon.coupon)
        : 0;
      const totalAmount = Math.max(subtotal - discountAmount, 0);
      const isBankTransfer = normalizedPaymentMethod === "BANK";

      const created = await tx.order.create({
        data: {
          userId,

          totalAmount,
          discountAmount,

          status: isBankTransfer ? "PENDING" : "PAID",
          paymentMethod: normalizedPaymentMethod,
          paidAt: isBankTransfer ? null : now,

          couponId: userCoupon ? userCoupon.couponId : null,

          shipName,
          shipPhone,
          shipZip,
          shipAddress1,
          shipAddress2,
          shipMemo,

          orderItems: {
            create: normalizedProducts.map((item) => ({
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

      await appendOrderEvent(tx, {
        orderId: created.id,
        eventType: "ORDER_CREATED" as OrderEventType,
        fromStatus: null,
        toStatus: created.status as OrderStatus,
        note: isBankTransfer ? "Bank transfer order created" : "Paid order created",
      });

      return created;
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("ORDER CREATE ERROR:", error);

    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
