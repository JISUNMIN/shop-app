// utils/cart.ts
import { auth } from "@/auth";
import type { LocalizedText, OrderItemView, CartItem } from "@/types";
import { NextRequest } from "next/server";

export const GUEST_CART_COOKIE = "roboshop-session";

export const formatCartItems = (
  cartItems: CartItem[],
  lang: keyof LocalizedText,
): OrderItemView[] => {
  return cartItems.map((item) => ({
    id: item.id,
    name: item.product.name[lang],
    quantity: item.quantity,
    price: item.product.price,
    image: item.product.images,
  }));
};

export function getGuestCartId(request: NextRequest) {
  const guestCartId = request.cookies.get(GUEST_CART_COOKIE)?.value;

  if (!guestCartId) {
    throw new Error("Missing guest cart id cookie");
  }

  return guestCartId;
}


export const getOwner = async (request: NextRequest) => {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const guestCartId = getGuestCartId(request);

  return {
    userId,
    guestCartId,
    whereOwner: userId ? ({ userId } as const) : ({ sessionId: guestCartId } as const),
  };
};