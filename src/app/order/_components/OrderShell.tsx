// app/order/_components/OrderShell.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import type { Address, Agreements, Coupon, OrderItem } from "@/types";
import {
  initialAddresses,
  mockCoupons,
  ORDER_AVAILABLE_POINTS,
  ORDER_DELIVERY_FEE,
  ORDER_FREE_SHIPPING_THRESHOLD,
} from "@/app/order/_components/order.mock";
import OrderCompleteModal from "@/app/order/complete/OrderCompleteModal";

import { OrderShippingSection } from "@/app/order/_components/sections/OrderShippingSection";
import { OrderItemsSection } from "@/app/order/_components/sections/OrderItemsSection";
import { OrderBenefitsSection } from "@/app/order/_components/sections/OrderBenefitsSection";
import { OrderPaymentSection } from "@/app/order/_components/sections/OrderPaymentSection";
import { OrderAgreementsSection } from "@/app/order/_components/sections/OrderAgreementsSection";
import { OrderSummarySection } from "@/app/order/_components/sections/OrderSummarySection";

import { AddressCreateDialog } from "@/app/order/_components/dialogs/AddressCreateDialog";
import { CouponSelectDialog } from "@/app/order/_components/dialogs/CouponSelectDialog";

import useCart from "@/hooks/useCart";
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

  agreements: Agreements;
};

export default function OrderShell() {
  const router = useRouter();
  const { listData: cartItems, removeFromCartMutate } = useCart();

  const { t, i18n } = useTranslation();
  const lang = i18n.language as keyof LocalizedText;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderedItems, setOrderedItems] = useState<OrderItem[]>([]);

  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showCouponDialog, setShowCouponDialog] = useState(false);

  const coupons: Coupon[] = mockCoupons;

  const orderItems = useMemo(() => formatCartItems(cartItems ?? [], lang), [cartItems, lang]);

  const methods = useForm<OrderFormValues>({
    mode: "onChange",
    defaultValues: {
      selectedAddressId: addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? 1,
      deliveryMemo: "custom", // key
      customMemo: "",
      paymentMethod: "card",
      selectedCouponId: null,
      usePoints: false,
      pointsToUse: 0,
      agreements: { terms: false, privacy: false, payment: false },
    },
  });

  const { watch, setValue, getValues } = methods;

  const selectedAddressId = watch("selectedAddressId");
  const selectedCouponId = watch("selectedCouponId");
  const usePoints = watch("usePoints");
  const pointsToUse = watch("pointsToUse");

  const subtotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [orderItems],
  );

  const selectedCoupon = useMemo(
    () => coupons.find((c) => c.id === selectedCouponId),
    [coupons, selectedCouponId],
  );

  const couponDiscount = useMemo(() => {
    if (!selectedCoupon) return 0;
    if (selectedCoupon.type === "percent") {
      return Math.floor((subtotal * Number(selectedCoupon.discount)) / 100);
    }
    return Number(selectedCoupon.discount);
  }, [selectedCoupon, subtotal]);

  const pointsMax = useMemo(
    () => Math.min(ORDER_AVAILABLE_POINTS, Math.max(0, subtotal - couponDiscount)),
    [subtotal, couponDiscount],
  );

  useEffect(() => {
    if (!usePoints && pointsToUse !== 0) {
      setValue("pointsToUse", 0, { shouldDirty: true, shouldValidate: true });
      return;
    }
    if (usePoints && pointsToUse > pointsMax) {
      setValue("pointsToUse", pointsMax, { shouldDirty: true, shouldValidate: true });
    }
  }, [usePoints, pointsToUse, pointsMax, setValue]);

  const pointsDiscount = usePoints ? pointsToUse : 0;
  const totalDiscount = couponDiscount + pointsDiscount;

  const finalDeliveryFee = subtotal >= ORDER_FREE_SHIPPING_THRESHOLD ? 0 : ORDER_DELIVERY_FEE;
  const finalAmount = subtotal + finalDeliveryFee - totalDiscount;
  const earnPoints = Math.floor(finalAmount * 0.05);

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedAddressId),
    [addresses, selectedAddressId],
  );

  const handleAddAddress = (newAddress: {
    name: string;
    recipient: string;
    phone: string;
    address: string;
    detailAddress: string;
    isDefault: boolean;
  }) => {
    const newId = Math.max(...addresses.map((a) => a.id), 0) + 1;
    const updated = newAddress.isDefault
      ? addresses.map((a) => ({ ...a, isDefault: false }))
      : addresses;

    setAddresses([...updated, { id: newId, ...newAddress }]);

    if (newAddress.isDefault) setValue("selectedAddressId", newId, { shouldDirty: true });

    setShowAddressDialog(false);
  };

  const handleOrderSubmit = async () => {
    const { agreements } = getValues();

    if (!agreements.terms || !agreements.privacy || !agreements.payment) {
      alert(t("order.alert.requiredAgreements"));
      return;
    }

    setOrderedItems(orderItems);

    // 장바구니에서 제거
    cartItems?.forEach((item) => removeFromCartMutate({ itemId: item.id, showToast: false }));

    setIsModalOpen(true);
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
              <OrderShippingSection
                addresses={addresses}
                onOpenAddressDialog={() => setShowAddressDialog(true)}
              />

              <OrderItemsSection orderItems={orderItems} />

              <OrderBenefitsSection
                selectedCoupon={selectedCoupon}
                couponDiscount={couponDiscount}
                availablePoints={ORDER_AVAILABLE_POINTS}
                pointsMax={pointsMax}
                onOpenCouponDialog={() => setShowCouponDialog(true)}
              />

              <OrderPaymentSection />
              <OrderAgreementsSection />
            </div>

            <div className="lg:col-span-1">
              <OrderSummarySection
                subtotal={subtotal}
                finalDeliveryFee={finalDeliveryFee}
                couponDiscount={couponDiscount}
                pointsDiscount={pointsDiscount}
                finalAmount={finalAmount}
                earnPoints={earnPoints}
                orderItems={orderItems}
                selectedAddress={selectedAddress}
                freeShippingThreshold={ORDER_FREE_SHIPPING_THRESHOLD}
                onSubmit={handleOrderSubmit}
              />
            </div>
          </div>
        </main>

        <AddressCreateDialog
          open={showAddressDialog}
          onOpenChange={setShowAddressDialog}
          onSubmit={handleAddAddress}
        />

        <CouponSelectDialog
          open={showCouponDialog}
          onOpenChange={setShowCouponDialog}
          coupons={coupons}
          subtotal={subtotal}
        />

        <OrderCompleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          orderedItems={orderedItems}
        />
      </div>
    </FormProvider>
  );
}
