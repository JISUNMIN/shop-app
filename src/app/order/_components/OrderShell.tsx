// app/order/_components/OrderShell.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

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
import useProducts from "@/hooks/useProducts";

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

type OrderItem = {
  id?: number;
  productId: number;
  name?: string;
  price: number;
  quantity: number;
  stock: number;
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

  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showCouponDialog, setShowCouponDialog] = useState(false);

  const cartItemIdsParam = searchParams.get("cartItemIds"); // 장바구니 주문
  const productIdParam = searchParams.get("productId"); // 바로 구매
  const quantityParamRaw = Number(searchParams.get("quantity") ?? "1");
  const quantityParam = Number.isFinite(quantityParamRaw) ? Math.max(1, quantityParamRaw) : 1;

  const selectedCartItemIds = useMemo(() => {
    if (!cartItemIdsParam) return [];
    return Array.from(
      new Set(
        cartItemIdsParam
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
      ),
    );
  }, [cartItemIdsParam]);

  const selectedCartItems = useMemo(() => {
    if (!selectedCartItemIds.length) return [];
    return cartItems?.filter((item) => selectedCartItemIds.includes(String(item.id))) ?? [];
  }, [cartItems, selectedCartItemIds]);

  const productId = productIdParam ? Number(productIdParam) : undefined;
  const shouldFetchProduct = !!productId && selectedCartItemIds.length === 0;
  const { detailData: productDetail } = useProducts(
    undefined,
    shouldFetchProduct ? productId : undefined,
  );

  const orderItems: OrderItem[] = useMemo(() => {
    if (selectedCartItems.length) {
      return formatCartItems(selectedCartItems, lang) as unknown as OrderItem[];
    }

    if (productDetail) {
      return [
        {
          productId: productDetail.id,
          name: productDetail.name?.[lang] ?? "",
          price: Number(productDetail.price) ?? 0,
          quantity: quantityParam,
          stock: Number(productDetail.stock) ?? 0,
          image: productDetail.images,
        },
      ];
    }

    return [];
  }, [selectedCartItems, lang, productDetail, quantityParam]);

  const defaultAddressId = useMemo(() => {
    const def = addressList?.find((a) => a.isDefault)?.id;
    return def ?? addressList?.[0]?.id ?? 0;
  }, [addressList]);

  const methods = useForm<OrderFormValues>({
    mode: "onChange",
    defaultValues: {
      selectedAddressId: defaultAddressId,
      deliveryMemo: "custom",
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
  const finalAmount = subtotal - totalDiscount;

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

    createOrderMutate(
      {
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
      },
      {
        onSuccess: (data: any) => {
          orderItems.forEach((item) => {
            if (typeof item.id === "number") {
              removeFromCartMutate({ itemId: item.id, showToast: false });
            }
          });

          const orderId = data?.id;
          router.replace(`/order/complete/${orderId}`);
        },
      },
    );
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
      </div>
    </FormProvider>
  );
}
