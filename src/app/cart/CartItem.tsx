"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

import { CartItem as CartItemType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import useCart from "@/hooks/useCart";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface CartItemProps {
  item: CartItemType;
  index?: number;
  checked: boolean;
  onCheckChange: (itemId: string, checked: boolean) => void;
}

const CartItem = ({
  item,
  index = 0,
  checked,
  onCheckChange,
}: CartItemProps) => {
  const [inputQuantity, setInputQuantity] = useState<number>(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    updateCartItemMutate,
    removeFromCartMutate,
    isUpdatePending,
    isRemovePending,
  } = useCart();

  const isDisabled = isUpdatePending || isRemovePending || isUpdating;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ko-KR").format(price);

  const handleInputChange = (value: string) => {
    if (value === "") {
      setInputQuantity(0);
      return;
    }

    let num = Number(value);
    if (isNaN(num)) return;

    if (num < 1) num = 1;
    if (num > item.product.stock) num = item.product.stock;

    setInputQuantity(num);
  };

  const handleApplyQuantity = (quantity?: number) => {
    if (isUpdating) return;

    let newQuantity = quantity ?? inputQuantity;
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity === item.quantity) return;

    setIsUpdating(true);
    updateCartItemMutate(
      { itemId: item.id, quantity: newQuantity },
      { onSettled: () => setIsUpdating(false) }
    );
  };

  const handleQuantityChangeButton = (delta: number) => {
    const newQuantity = inputQuantity + delta;
    if (newQuantity < 1 || newQuantity > item.product.stock) return;

    setInputQuantity(newQuantity);
    handleApplyQuantity(newQuantity);
  };

  const handleRemove = () => {
    if (isDisabled) return;
    removeFromCartMutate(item.id);
  };

  const totalPrice = item.product.price * item.quantity;
  const isLowStock = item.product.stock <= 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
      layout
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Checkbox
              checked={checked}
              onCheckedChange={(val) => onCheckChange(item.id, !!val)}
            />

            {/* 상품 이미지 */}
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 mx-auto sm:mx-0">
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
              <div className="space-y-1 text-center sm:text-left">
                <Link
                  href={`/product/${item.product.id}`}
                  className="font-medium hover:text-primary transition-colors line-clamp-2"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  개당 {formatPrice(item.product.price)}원
                </p>
                <p className="text-xs text-muted-foreground">
                  최대 주문 가능 수량: {item.product.stock}개
                </p>
                {isLowStock && (
                  <p className="text-xs text-orange-600 font-medium">
                    재고 {item.product.stock}개 남음
                  </p>
                )}
              </div>

              {/* 컨트롤 영역 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-3 sm:gap-0">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChangeButton(-1)}
                    disabled={item.quantity <= 1 || isDisabled}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <Input
                    type="number"
                    min={1}
                    max={item.product.stock}
                    value={inputQuantity === 0 ? "" : inputQuantity}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyQuantity(inputQuantity);
                      }
                    }}
                    className={cn(
                      "w-12 text-center rounded border border-gray-300 p-1 text-sm",
                      isUpdating && "opacity-50"
                    )}
                  />

                  <Button
                    size="sm"
                    onClick={() => handleApplyQuantity(inputQuantity)}
                    disabled={isDisabled}
                  >
                    변경
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChangeButton(1)}
                    disabled={item.quantity >= item.product.stock || isDisabled}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* 가격 및 삭제 버튼 */}
                <div className="flex items-center justify-between mt-3 border-t border-gray-200 sm:border-t-0 pt-2 sm:pt-0">
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
