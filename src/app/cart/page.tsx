"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import useCart from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { CartSkeleton, EmptyCart, CartSummary, CartItem } from "@/app/cart";
import ErrorMessage from "@/components/ErrorMessage";

export default function CartPage() {
  const router = useRouter();
  const {
    listData: cartItems,
    isListLoading,
    listError,
    removeFromCartMutate,
    isRemovePending,
  } = useCart();
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {}
  );

  const totalItems =
    cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice =
    cartItems?.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;
  const shippingFee = totalPrice >= 30000 ? 0 : 3000;
  const finalPrice = totalPrice + shippingFee;

  const handleOrder = async () => {
    try {
      cartItems?.forEach((item) => removeFromCartMutate(item.id));
      setSelectedItems({});
      router.push("/order/complete");
    } catch (error: any) {
      toast.error("주문 실패", {
        description: error.message || "주문을 처리할 수 없습니다.",
      });
    }
  };

  const handleCheckChange = (itemId: string, checked: boolean) => {
    setSelectedItems((prev) => ({ ...prev, [itemId]: checked }));
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected: Record<string, boolean> = {};
    cartItems?.forEach((item) => (newSelected[item.id] = checked));
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedItems).filter(
      (id) => selectedItems[id]
    );
    idsToDelete.forEach((id) => removeFromCartMutate(id));
    setSelectedItems({});
  };

  if (isListLoading) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-6 w-48" />
        </div>
        <CartSkeleton />
      </div>
    );
  }

  if (listError) {
    return (
      <ErrorMessage
        message="장바구니를 불러올 수 없습니다."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <>
      <div className="container py-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> 뒤로가기
              </Button>
              <div>
                <h1 className="text-2xl font-bold">장바구니</h1>
                <p className="text-muted-foreground">
                  {totalItems}개의 로봇이 담겨있습니다
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {cartItems && cartItems.length > 0 && (
          <div className="flex items-center justify-between mb-4 space-x-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={cartItems.every((item) => selectedItems[item.id])}
                onCheckedChange={(val) => handleSelectAll(!!val)}
              />
              <span className="text-sm">전체 선택</span>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={handleDeleteSelected}
                disabled={!Object.values(selectedItems).some(Boolean)}
              >
                선택 삭제
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  cartItems.forEach((item) => removeFromCartMutate(item.id));
                  setSelectedItems({});
                }}
                disabled={cartItems.length === 0 || isRemovePending}
              >
                전체 삭제
              </Button>
            </div>
          </div>
        )}

        {/* 메인 콘텐츠 */}
        <AnimatePresence mode="wait">
          {!cartItems || cartItems.length === 0 ? (
            <EmptyCart key="empty" />
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-8 lg:grid-cols-3"
            >
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item, index) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        index={index}
                        checked={!!selectedItems[item.id]}
                        onCheckChange={handleCheckChange}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* 주문 요약 */}
              <div className="lg:col-span-1">
                <CartSummary
                  totalItems={totalItems}
                  totalPrice={totalPrice}
                  shippingFee={shippingFee}
                  finalPrice={finalPrice}
                  onOrder={handleOrder}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
