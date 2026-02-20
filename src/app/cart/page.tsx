"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import useCart from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { CartSkeleton, EmptyCart, CartSummary, CartItem } from "@/app/cart";
import ErrorMessage from "@/components/ErrorMessage";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const {
    listData: cartItems,
    isListLoading,
    listError,
    removeFromCartMutate,
    isRemovePending,
  } = useCart();

  const { t } = useTranslation();
  const { data: session } = useSession();
  const user = session?.user;

  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>({});

  const selectedCartItems = useMemo(
    () => cartItems?.filter((item) => selectedItems[item.id]) || [],
    [cartItems, selectedItems],
  );

  const totalItems = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = selectedCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  // const shippingFee = totalPrice >= 30000 ? 0 : 3000;
  const shippingFee = 0;
  const finalPrice = totalPrice + shippingFee;

  const handleCheckChange = (itemId: number, checked: boolean) => {
    setSelectedItems((prev) => ({ ...prev, [itemId]: checked }));
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected: Record<number, boolean> = {};
    cartItems?.forEach((item) => (newSelected[item.id] = checked));
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedItems).filter((id) => selectedItems[Number(id)]);
    idsToDelete.forEach((id) => removeFromCartMutate({ itemId: Number(id) }));
    setSelectedItems({});
  };

  const selectedOrderItems = useMemo(
    () =>
      selectedCartItems.map((ci) => ({
        productId: ci.product.id,
        quantity: ci.quantity,
      })),
    [selectedCartItems],
  );

  const onOrder = () => {
    const params = new URLSearchParams();
    params.set("items", JSON.stringify(selectedOrderItems));

    const orderUrl = `/order?${params.toString()}`;

    if (!user) {
      toast.warning(t("loginRequired"));

      const loginUrl = `/login?${new URLSearchParams({
        callbackUrl: orderUrl,
      }).toString()}`;

      return router.push(loginUrl);
    }

    router.push(orderUrl);
  };

  useEffect(() => {
    if (!cartItems) return;

    setSelectedItems((prev) => {
      const next: Record<number, boolean> = {};

      cartItems.forEach((item) => {
        next[item.id] = prev[item.id] ?? true;
      });

      return next;
    });
  }, [cartItems]);

  if (isListLoading) {
    return (
      <div>
        <Skeleton className="h-10 w-32 mb-4" />
        <Skeleton className="h-6 w-48" />
        <CartSkeleton />
      </div>
    );
  }

  if (listError) {
    return <ErrorMessage message={t("cartLoadError")} onRetry={() => window.location.reload()} />;
  }

  return (
    <>
      {/* 헤더 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold sm:text-xl">{t("cart")}</h1>
              <p className="text-muted-foreground text-sm sm:text-xs">
                {t("cartRobotCount", { count: totalItems })}
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
            <span className="text-sm">{t("selectAll")}</span>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={handleDeleteSelected}
              disabled={!Object.values(selectedItems).some(Boolean)}
            >
              {t("deleteSelected")}
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
              {t("deleteAll")}
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
                onOrder={onOrder}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
