"use client";

import { useEffect, useState } from "react";
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
import OrderCompleteModal from "@/app/order/complete/OrderCompleteModal";
import { useTranslation } from "@/context/TranslationContext";
import { formatString } from "@/utils/helper";
import { useLangStore } from "@/store/langStore";

export default function CartPage() {
  const router = useRouter();
  const {
    listData: cartItems,
    isListLoading,
    listError,
    removeFromCartMutate,
    isRemovePending,
  } = useCart();
  const { lang } = useLangStore();
  const t = useTranslation();

  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderedItems, setOrderedItems] = useState<
    { id: string; name: string; quantity: number; price: number }[]
  >([]);

  const selectedCartItems = cartItems?.filter((item) => selectedItems[item.id]) || [];

  const totalItems = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = selectedCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = totalPrice >= 30000 ? 0 : 3000;
  const finalPrice = totalPrice + shippingFee;

  const handleOrder = async () => {
    try {
      if (selectedCartItems.length === 0) {
        toast.error(t.selectOrderItem);
        return;
      }

      const formattedItems = selectedCartItems.map((item) => ({
        id: item.id,
        name: item.product.name[lang],
        quantity: item.quantity,
        price: item.product.price,
      }));
      setOrderedItems(formattedItems);

      setIsModalOpen(true);

      // 장바구니에서 제거
      selectedCartItems.forEach((item) =>
        removeFromCartMutate({ itemId: item.id, showToast: false })
      );

      setSelectedItems({});
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t.orderFailedDescription;

      toast.error(t.orderFailed, { description: message });
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
    const idsToDelete = Object.keys(selectedItems).filter((id) => selectedItems[id]);
    idsToDelete.forEach((id) => removeFromCartMutate({ itemId: id }));
    setSelectedItems({});
  };

  useEffect(() => {
    if (cartItems) {
      const initialSelected: Record<string, boolean> = {};
      cartItems.forEach((item) => (initialSelected[item.id] = true));
      setSelectedItems(initialSelected);
    }
  }, [cartItems]);

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
    return <ErrorMessage message={t.cartLoadError} onRetry={() => window.location.reload()} />;
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
              <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t.back}
              </Button>
              <div>
                <h1 className="text-2xl font-bold sm:text-xl">{t.cart}</h1>
                <p className="text-muted-foreground text-sm sm:text-xs">
                  {formatString(t.cartRobotCount, { count: totalItems })}
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
              <span className="text-sm">{t.selectAll}</span>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={handleDeleteSelected}
                disabled={!Object.values(selectedItems).some(Boolean)}
              >
                {t.deleteSelected}
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  cartItems.forEach((item) => removeFromCartMutate({ itemId: item.id }));
                  setSelectedItems({});
                }}
                disabled={cartItems.length === 0 || isRemovePending}
              >
                {t.deleteAll}
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

      <OrderCompleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderedItems={orderedItems}
      />
    </>
  );
}
