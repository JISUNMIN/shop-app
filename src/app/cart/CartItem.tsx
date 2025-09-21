// src/components/cart/CartItem.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { CartItem as CartItemType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import useCart from "@/hooks/useCart";

interface CartItemProps {
  item: CartItemType;
  index?: number;
}

const CartItem = ({ item, index = 0 }: CartItemProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    updateCartItemMutate,
    removeFromCartMutate,
    isUpdatePending,
    isRemovePending,
  } = useCart();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.product.stock || isUpdating)
      return;

    setIsUpdating(true);
    try {
      await updateCartItemMutate({ itemId: item.id, quantity: newQuantity });
    } catch (error: any) {
      toast.error("수량 변경 실패", {
        description: error.message || "수량을 변경할 수 없습니다.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCartMutate(item.id);
      toast.success("상품이 제거되었습니다", {
        description: `${item.product.name}이(가) 장바구니에서 제거되었습니다.`,
      });
    } catch (error: any) {
      toast.error("제거 실패", {
        description: error.message || "상품을 제거할 수 없습니다.",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const totalPrice = item.product.price * item.quantity;
  const isLowStock = item.product.stock <= 10;
  const isDisabled = isUpdatePending || isRemovePending || isUpdating;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      layout
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* 상품 이미지 */}
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
              <Link href={`/product/${item.product.id}`}>
                <Image
                  src={item.product.images[0] || "/placeholder.jpg"}
                  alt={item.product.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="96px"
                />
              </Link>
            </div>

            {/* 상품 정보 */}
            <div className="flex flex-1 flex-col justify-between">
              <div className="space-y-1">
                <Link
                  href={`/product/${item.product.id}`}
                  className="font-medium hover:text-primary transition-colors line-clamp-2"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  개당 {formatPrice(item.product.price)}원
                </p>
                {isLowStock && (
                  <p className="text-xs text-orange-600 font-medium">
                    재고 {item.product.stock}개 남음
                  </p>
                )}
              </div>

              {/* 컨트롤 영역 */}
              <div className="flex items-center justify-between mt-3">
                {/* 수량 조절 */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={item.quantity <= 1 || isDisabled}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <span
                    className={cn(
                      "w-8 text-center text-sm font-medium",
                      isUpdating && "opacity-50"
                    )}
                  >
                    {item.quantity}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock || isDisabled}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* 가격 및 삭제 버튼 */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-bold text-primary">
                      {formatPrice(totalPrice)}원
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-xs text-muted-foreground">
                        {item.quantity}개
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={handleRemove}
                    disabled={isDisabled}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CartItem;
