// utils/cart.ts
import type { LocalizedText, OrderItemView, CartItem } from "@/types";

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
