// app/order/_components/OrderShell.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import {
  ORDER_AVAILABLE_POINTS,
  ORDER_DELIVERY_FEE,
  ORDER_FREE_SHIPPING_THRESHOLD,
} from "@/app/order/_components/order.mock";
import OrderCompleteModal from "@/app/order/complete/OrderCompleteModal";

import { OrderAddressSection } from "@/app/order/_components/sections/OrderAddressSection";
import { OrderItemsSection } from "@/app/order/_components/sections/OrderItemsSection";
import { OrderBenefitsSection } from "@/app/order/_components/sections/OrderBenefitsSection";
import { OrderPaymentSection } from "@/app/order/_components/sections/OrderPaymentSection";
import { OrderSummarySection } from "@/app/order/_components/sections/OrderSummarySection";

import { AddressCreateDialog } from "@/app/order/_components/dialogs/AddressCreateDialog";
import { CouponSelectDialog } from "@/app/order/_components/dialogs/CouponSelectDialog";

import useCart from "@/hooks/useCart";
import useAddress from "@/hooks/useAddress";
import useCoupon from "@/hooks/useCoupon";
import useOrder from "@/hooks/useOrder";

import { formatCartItems } from "@/utils/cart";
import type { LocalizedText } from "@/types";

export type PaymentMethod = "card" | "bank" | "kakao" | "naver";

export type OrderFormValues = {
  selectedAddressId: number;
  deliveryMemo: string; // key
  customMemo: string;

  paymentMethod: PaymentMethod;

  selectedCouponId: number | null;

  usePoints: boolean;
  pointsToUse: number;
};

export default function OrderShell() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { listData: cartItems, isListLoading, removeFromCartMutate } = useCart();
  const { listData: addressList } = useAddress();
  const { listData: couponList } = useCoupon();
  const { createOrderMutate, isCreateOrderPending } = useOrder();

  const { t, i18n } = useTranslation();
  const lang = i18n.language as keyof LocalizedText;

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showCouponDialog, setShowCouponDialog] = useState(false);

  const itemIdsParam = searchParams.get("itemIds");
  const selectedIdSet = useMemo(() => {
    const ids = (itemIdsParam ?? "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    return new Set(ids);
  }, [itemIdsParam]);

  const selectedCartItems = useMemo(() => {
    return cartItems?.filter((item) => selectedIdSet.has(String(item.id)));
  }, [cartItems, selectedIdSet]);

  const orderItems = useMemo(
    () => formatCartItems(selectedCartItems ?? [], lang),
    [selectedCartItems, lang],
  );

  const methods = useForm<OrderFormValues>({
    mode: "onChange",
    defaultValues: {
      selectedAddressId: addressList?.find((a) => a.isDefault)?.id ?? addressList?.[0]?.id,
      deliveryMemo: "custom", // key
      customMemo: "",
      paymentMethod: "card",
      selectedCouponId: null,
      usePoints: false,
      pointsToUse: 0,
    },
  });

  const { watch } = methods;

  const selectedAddressId = watch("selectedAddressId");
  const selectedCouponId = watch("selectedCouponId");
  const usePoints = watch("usePoints");
  const pointsToUse = watch("pointsToUse");
  const deliveryMemo = watch("deliveryMemo");
  const customMemo = watch("customMemo");

  const subtotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [orderItems],
  );

  const selectedCoupon = useMemo(
    () => couponList?.find((c) => c.id === selectedCouponId),
    [couponList, selectedCouponId],
  );

  const couponDiscount = useMemo(() => {
    if (!selectedCoupon) return 0;
    if (selectedCoupon.coupon.discountType === "PERCENT") {
      return Math.floor((subtotal * Number(selectedCoupon.coupon.discountValue)) / 100);
    }
    return Number(selectedCoupon.discount);
  }, [selectedCoupon, subtotal]);

  const pointsDiscount = usePoints ? pointsToUse : 0;
  const totalDiscount = couponDiscount + pointsDiscount;

  const finalDeliveryFee = subtotal >= ORDER_FREE_SHIPPING_THRESHOLD ? 0 : ORDER_DELIVERY_FEE;
  const finalAmount = subtotal + finalDeliveryFee - totalDiscount;

  const selectedAddress = useMemo(
    () => addressList?.find((a) => a.id === selectedAddressId),
    [addressList, selectedAddressId],
  );

  const hasOutOfStock = useMemo(() => orderItems.some((i) => i.quantity > i.stock), [orderItems]);

  const canPay = !!selectedAddress && orderItems.length > 0;

  const handlePay = async () => {
    if (!selectedAddress || orderItems.length === 0) return;

    const shipMemo =
      deliveryMemo === "custom" ? (customMemo?.trim() ? customMemo.trim() : null) : deliveryMemo;

    createOrderMutate({
      shipName: selectedAddress.name,
      shipPhone: selectedAddress.phone,
      shipZip: selectedAddress.zip ?? null,
      shipAddress1: selectedAddress.address1,
      shipAddress2: selectedAddress.address2 ?? null,
      shipMemo,

      totalAmount: finalAmount,
      discountAmount: totalDiscount,
      couponId: selectedCouponId ?? null,

      products: orderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    setIsCompleteModalOpen(true);
  };

  const onClosesOrderModal = async () => {
    // 장바구니에서 제거
    orderItems?.forEach((item) => removeFromCartMutate({ itemId: item.id, showToast: false }));
    setIsCompleteModalOpen(false);
    router.push("/");
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl md:text-2xl font-bold">{t("order.title")}</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* 배송지 정보 */}
              <OrderAddressSection onOpenAddressDialog={() => setShowAddressDialog(true)} />

              {/* 주문 상품 */}
              <OrderItemsSection orderItems={orderItems} isListLoading={isListLoading} />

              {/* 할인및 혜택 */}
              <OrderBenefitsSection
                selectedCoupon={selectedCoupon}
                couponDiscount={couponDiscount}
                availablePoints={ORDER_AVAILABLE_POINTS}
                pointsMax={0}
                onOpenCouponDialog={() => setShowCouponDialog(true)}
              />

              {/* 결제 수단 */}
              <OrderPaymentSection />
            </div>

            <div className="lg:col-span-1">
              {/* 우측 결제 요약 */}
              <OrderSummarySection
                isLoading={isListLoading}
                subtotal={subtotal}
                deliveryFee={finalDeliveryFee}
                freeShippingThreshold={ORDER_FREE_SHIPPING_THRESHOLD}
                couponDiscount={couponDiscount}
                pointsDiscount={pointsDiscount}
                finalAmount={finalAmount}
                canPay={canPay}
                hasOutOfStock={hasOutOfStock}
                isPaying={isCreateOrderPending}
                onClickPay={handlePay}
              />
            </div>
          </div>
        </main>

        <AddressCreateDialog open={showAddressDialog} onOpenChange={setShowAddressDialog} />

        <CouponSelectDialog
          open={showCouponDialog}
          onOpenChange={setShowCouponDialog}
          coupons={couponList}
          subtotal={subtotal}
        />

        <OrderCompleteModal
          isOpen={isCompleteModalOpen}
          onClose={onClosesOrderModal}
          orderedItems={orderItems}
        />
      </div>
    </FormProvider>
  );
}
