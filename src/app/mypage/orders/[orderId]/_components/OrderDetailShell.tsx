"use client";

import useOrder from "@/hooks/useOrder";
import { ChevronLeft, Truck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { formatDate, formatPrice } from "@/utils/helper";
import type { LangCode } from "@/types";
import { DeliveryProgress } from "./DeliveryProgress";
import OrderDetailSkeleton from "./OrderDetailSkeleton";
import EmptyOrderState from "./EmptyOrderState";
import { Badge } from "@/components/ui/badge";

import {
  getDeliveryProgressStep,
  getShipMemoText,
  getShippingStatusLabel,
  ORDER_STATUS_BADGE_CLASS,
} from "@/utils/orders";

export default function OrderDetailShell() {
  const router = useRouter();
  const { orderId } = useParams<{ orderId: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as LangCode;

  const { detailData: order, isDetailLoading } = useOrder(Number(orderId));

  // ✅ 로딩 먼저 처리 (로딩 중 !order로 Empty 뜨는 문제 방지)
  if (isDetailLoading) {
    return <OrderDetailSkeleton />;
  }

  if (orderId === null || !order) {
    const message =
      orderId === null ? t("mypage.orderDetail.invalidOrderId") : t("mypage.orderDetail.notFound");
    return <EmptyOrderState message={message} />;
  }

  const shipMemo = getShipMemoText(order.shipMemo, t);

  const statusLabel = t(`order.status.${order.status.toLowerCase()}` as any);

  const shippingStatusLabel = getShippingStatusLabel(order.status, t);

  const progressStep = getDeliveryProgressStep(order.status);

  const progressLabels = [
    t("mypage.orderDetail.progress.ordered"),
    t("mypage.orderDetail.progress.preparing"),
    t("mypage.orderDetail.progress.shipping"),
    t("mypage.orderDetail.progress.delivered"),
  ];

  const orderedAt = formatDate(order.createdAt, lang);

  const productPrice = order.totalAmount ?? 0;
  const discount = order.discountAmount ?? 0;
  const shippingFee = 0;
  const totalPrice = Math.max(productPrice - discount + shippingFee, 0);
  const items = order.orderItems ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 sm:p-6">
        <main className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
            {/* Back */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-black mb-4 sm:mb-6 transition-colors"
              aria-label={t("mypage.orderDetail.back")}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
                <h1 className="text-xl sm:text-2xl font-semibold">
                  {t("mypage.orderDetail.title")}
                </h1>

                <Badge
                  className={[
                    "px-3 py-1 text-xs sm:text-sm font-medium rounded-full",
                    ORDER_STATUS_BADGE_CLASS[order.status] ?? "bg-gray-100 text-gray-700",
                  ].join(" ")}
                >
                  {statusLabel}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
                <span>{t("mypage.orderDetail.orderNumber", { id: order.id })}</span>
                <span>{t("mypage.orderDetail.orderedAt", { date: orderedAt })}</span>
              </div>
            </div>

            {/* Delivery */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Truck className="w-6 h-6 text-blue-600" />
                <h2 className="font-semibold">{t("mypage.orderDetail.deliveryInfo.title")}</h2>
              </div>

              <p className="text-sm text-gray-700">
                {t("mypage.orderDetail.deliveryInfo.currentStatus")}:{" "}
                <span className="font-semibold">{shippingStatusLabel}</span>
              </p>

              <DeliveryProgress step={progressStep} labels={progressLabels} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mt-4">
                <div>
                  <p className="text-gray-600 mb-1">
                    {t("mypage.orderDetail.deliveryInfo.carrier")}
                  </p>
                  <p className="font-medium break-words">{order.carrier ?? "-"}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">
                    {t("mypage.orderDetail.deliveryInfo.trackingNumber")}
                  </p>
                  <p className="font-medium break-words">{order.trackingNumber ?? "-"}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">{t("mypage.orderDetail.deliveryInfo.memo")}</p>
                  <p className="font-medium break-words">{shipMemo}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6 sm:mb-8">
              <h2 className="font-semibold mb-3 sm:mb-4">{t("mypage.orderDetail.items.title")}</h2>

              <div className="space-y-4">
                {items.map((item) => {
                  const name = item.product?.name?.[lang] ?? "-";
                  const qty = Number(item.quantity ?? 1);
                  const price = Number(item.price ?? 0);
                  const lineTotal = Math.max(price * qty, 0);

                  return (
                    <div
                      key={String(item.id)}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="w-full sm:w-24 h-48 sm:h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.product?.images?.[0]}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium mb-1 break-words">{name}</h3>
                        <p className="text-sm text-gray-600">
                          {t("mypage.orderDetail.items.qty", { qty })}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="font-semibold">
                          {t("price", { price: formatPrice(lineTotal, lang) })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6 sm:mb-8">
              <h2 className="font-semibold mb-3 sm:mb-4">
                {t("mypage.orderDetail.shippingAddress.title")}
              </h2>

              <div className="p-4 sm:p-6 border border-gray-200 rounded-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <span className="sm:w-28 text-gray-600">
                    {t("mypage.orderDetail.shippingAddress.name")}
                  </span>
                  <span className="break-words">{order.shipName ?? "-"}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <span className="sm:w-28 text-gray-600">
                    {t("mypage.orderDetail.shippingAddress.phone")}
                  </span>
                  <span className="break-words">{order.shipPhone ?? "-"}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <span className="sm:w-28 text-gray-600">
                    {t("mypage.orderDetail.shippingAddress.address")}
                  </span>
                  <div className="break-words">
                    {order.shipZip && <p>[{order.shipZip}]</p>}
                    <p>{order.shipAddress1 ?? "-"}</p>
                    {order.shipAddress2 && <p>{order.shipAddress2}</p>}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <span className="sm:w-28 text-gray-600">
                    {t("mypage.orderDetail.shippingAddress.request")}
                  </span>
                  <span className="break-words">{shipMemo}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mb-6 sm:mb-8">
              <h2 className="font-semibold mb-3 sm:mb-4">
                {t("mypage.orderDetail.payment.title")}
              </h2>

              <div className="p-4 sm:p-6 border border-gray-200 rounded-lg">
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">
                      {t("mypage.orderDetail.payment.productPrice")}
                    </span>
                    <span className="text-right">
                      {t("price", { price: formatPrice(productPrice, lang) })}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">
                      {t("mypage.orderDetail.payment.shippingFee")}
                    </span>
                    <span className="text-right">
                      {t("price", { price: formatPrice(shippingFee, lang) })}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between gap-4 text-red-500">
                      <span>{t("mypage.orderDetail.payment.discount")}</span>
                      <span className="text-right">
                        -{t("price", { price: formatPrice(discount, lang) })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-end gap-4">
                  <span className="font-semibold">{t("mypage.orderDetail.payment.total")}</span>
                  <span className="text-xl sm:text-2xl font-semibold text-right">
                    {t("price", { price: formatPrice(totalPrice, lang) })}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  {t("mypage.orderDetail.payment.notice")}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="w-full sm:flex-1 min-w-[180px] px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!order.trackingNumber}
                title={!order.trackingNumber ? t("mypage.orderDetail.actions.trackDisabled") : ""}
              >
                {t("mypage.orderDetail.actions.track")}
              </button>

              <button className="w-full sm:flex-1 min-w-[180px] px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                {t("mypage.orderDetail.actions.returnExchange")}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
