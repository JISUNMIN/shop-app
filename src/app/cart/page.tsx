// src/app/cart/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import useCart from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CartSkeleton, EmptyCart, CartSummary, CartItem } from "@/app/cart";
import ErrorMessage from "@/components/ErrorMessage";

export default function CartPage() {
  const router = useRouter();
  const [showOrderModal, setShowOrderModal] = useState(false);

  const { listData: cartItems, isListLoading, listError } = useCart();

  const handleOrder = async () => {
    try {
      setShowOrderModal(true);
    } catch (error: any) {
      toast.error("주문 실패", {
        description: error.message || "주문을 처리할 수 없습니다.",
      });
    }
  };

  const handleOrderComplete = () => {
    setShowOrderModal(false);
    router.push("/");
  };

  // 계산
  const totalItems =
    cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice =
    cartItems?.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;
  const shippingFee = totalPrice >= 30000 ? 0 : 3000;
  const finalPrice = totalPrice + shippingFee;

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
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                뒤로가기
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
              {/* 장바구니 아이템 목록 */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item, index) => (
                      <CartItem key={item.id} item={item} index={index} />
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

      {/* 주문 완료 모달 */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>주문이 완료되었습니다!</DialogTitle>
            <DialogDescription>
              로봇 주문이 성공적으로 접수되었습니다. 빠른 시일 내에
              배송해드리겠습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleOrderComplete}>
              쇼핑 계속하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
