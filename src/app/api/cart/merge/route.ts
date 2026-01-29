// src/app/api/cart/merge/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getGuestCartId } from "@/utils/cart";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const guestCartId = getGuestCartId(request);

    // 1) guest cart 조회
    const guestItems = await prisma.cartItem.findMany({
      where: { sessionId: guestCartId },
      include: { product: true },
    });

    if (guestItems.length === 0) {
      return NextResponse.json({ merged: 0 });
    }

    // 2)  user cart로 merge
    for (const item of guestItems) {
      // user cart에 같은 상품이 있는지 확인
      const existingUserItem = await prisma.cartItem.findUnique({
        where: {
          productId_userId: {
            productId: item.productId,
            userId,
          },
        },
      });

      // 합쳐질 최종 수량
      const mergedQuantity = (existingUserItem?.quantity ?? 0) + item.quantity;

      // 재고보다 많으면 stock까지만 허용
      const finalQuantity = Math.min(mergedQuantity, item.product.stock);

      if (existingUserItem) {
        // 기존 user cart 업데이트
        await prisma.cartItem.update({
          where: { id: existingUserItem.id },
          data: { quantity: finalQuantity },
        });
      } else {
        // 새로 user cart에 생성
        await prisma.cartItem.create({
          data: {
            productId: item.productId,
            quantity: Math.min(item.quantity, item.product.stock),
            userId,
          },
        });
      }
    }

    // guest cart 비우기
    await prisma.cartItem.deleteMany({
      where: { sessionId: guestCartId },
    });

    return NextResponse.json({
      merged: guestItems.length,
      message: "Guest cart merged into user cart",
    });
  } catch (error) {
    console.error("Cart MERGE Error:", error);
    return NextResponse.json({ error: "Failed to merge cart" }, { status: 500 });
  }
}
