// src/app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 장바구니 조회
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.headers.get("x-session-id") || "anonymous";

    const cartItems = await prisma.cartItem.findMany({
      where: { sessionId },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Cart GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// 장바구니에 상품 추가/업데이트
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.headers.get("x-session-id") || "anonymous";
    const { productId, quantity } = await request.json();

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid product ID or quantity" },
        { status: 400 }
      );
    }

    // 상품 존재 여부 및 재고 확인
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 기존 장바구니 아이템 확인
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        productId_sessionId: {
          productId,
          sessionId,
        },
      },
    });

    let cartItem;
    if (existingItem) {
      // 기존 아이템 수량 업데이트
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return NextResponse.json(
          { error: `재고가 부족합니다. (재고: ${product.stock}개)` },
          { status: 400 }
        );
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true },
      });
    } else {
      // 새 아이템 추가
      if (quantity > product.stock) {
        return NextResponse.json(
          { error: `재고가 부족합니다. (재고: ${product.stock}개)` },
          { status: 400 }
        );
      }

      cartItem = await prisma.cartItem.create({
        data: {
          productId,
          quantity,
          sessionId,
        },
        include: { product: true },
      });
    }

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("Cart POST Error:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

// 장바구니 아이템 수량 수정
export async function PATCH(request: NextRequest) {
  try {
    const sessionId = request.headers.get("x-session-id") || "anonymous";
    const { itemId, quantity } = await request.json();

    if (!itemId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid item ID or quantity" },
        { status: 400 }
      );
    }

    // 장바구니 아이템 조회 및 권한 확인
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        sessionId,
      },
      include: { product: true },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // 재고 확인
    if (quantity > cartItem.product.stock) {
      return NextResponse.json(
        { error: `재고가 부족합니다. (재고: ${cartItem.product.stock}개)` },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Cart PATCH Error:", error);
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

// 장바구니 아이템 삭제
export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.headers.get("x-session-id") || "anonymous";
    const { searchParams } = new URL(request.url);
    const itemId = Number(searchParams.get("itemId"));

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    // 권한 확인
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        sessionId,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to remove cart item" },
      { status: 500 }
    );
  }
}
