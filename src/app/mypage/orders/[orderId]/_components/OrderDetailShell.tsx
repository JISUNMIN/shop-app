"use client";

import useOrder from "@/hooks/useOrder";
import { ChevronLeft, Truck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { formatDate, formatPrice } from "@/utils/helper";
import type { LangCode } from "@/types";
import OrderDetailSkeleton from "./OrderDetailSkeleton";
import EmptyOrderState from "./EmptyOrderState";
import { Badge } from "@/components/ui/badge";

import {
  getAvailableOrderActions,
  getOrderAttentionSummary,
  getOrderCustomerActionSummary,
  getOrderProgressPercent,
  getOrderStatusLabel,
  getShipMemoText,
  getShippingStatusLabel,
  ORDER_STATUS_BADGE_CLASS,
} from "@/utils/orders";
import OrderClaimDialog from "./OrderClaimDialog";
import { useState } from "react";
import OrderStatusTimeline from "./OrderStatusTimeline";
import Image from "next/image";
import OrderStatusDebugPanel from "./OrderStatusDebugPanel";
import OrderTrackingDialog from "./OrderTrackingDialog";

export default function OrderDetailShell() {
  const router = useRouter();
  const { orderId } = useParams<{ orderId: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as LangCode;
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"cancel" | "return_exchange">("cancel");
  const [trackingOpen, setTrackingOpen] = useState(false);

  const { detailData: order, isDetailLoading } = useOrder(Number(orderId));
  const methodKey = order?.paymentMethod?.toLowerCase();
  const isBank = order?.paymentMethod === "BANK";
  if (isDetailLoading) {
    return <OrderDetailSkeleton />;
  }

  if (orderId === null || !order) {
    const message =
      orderId === null ? t("mypage.orderDetail.invalidOrderId") : t("mypage.orderDetail.notFound");
    return <EmptyOrderState message={message} />;
  }

  const shipMemo = getShipMemoText(order.shipMemo, t);

  const statusLabel = getOrderStatusLabel(order.status, t);
  const shippingStatusLabel = getShippingStatusLabel(order.status, t);
  const availableActions = getAvailableOrderActions(order.status);
  const canCancel = availableActions.includes("cancel");
  const canReturn = availableActions.includes("return");
  const attention = getOrderAttentionSummary(order, t);
  const customerAction = getOrderCustomerActionSummary(order, t);
  const progressPercent = getOrderProgressPercent(order.status);
  const timelineEventCount = order.orderEvents?.length ?? 0;

  const orderedAt = formatDate(order.createdAt, lang);

  const totalPrice = order.totalAmount ?? 0;
  const discount = order.discountAmount ?? 0;
  const shippingFee = 0;
  const productPrice = Math.max(totalPrice + discount - shippingFee, 0);
  const items = order.orderItems ?? [];

  const orderActionLabel = canCancel
    ? "mypage.orderDetail.actions.cancel"
    : "mypage.orderDetail.actions.returnExchange";

  const insightToneClassMap: Record<string, string> = {
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
  };

  const handleOrderAction = () => {
    if (canCancel) {
      openCancel();
      return;
    }

    if (canReturn) {
      openRefundReturn();
    }
  };

  const openCancel = () => {
    setMode("cancel");
    setOpen(true);
  };
  const openRefundReturn = () => {
    setMode("return_exchange");
    setOpen(true);
  };

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
                <span>{t("mypage.orders.orderNumber", { id: order.id })}</span>
                <span>{t("mypage.orderDetail.orderedAt", { date: orderedAt })}</span>
              </div>
            </div>

            <div className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                      {t("mypage.orderDetail.insights.fulfillmentTitle")}
                    </p>
                    <p className="mt-3 text-xl font-bold">{attention.label}</p>
                    <p className="mt-2 text-sm text-slate-300">{attention.description}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-300">{progressPercent}%</p>
                </div>

                <div className="mt-4 h-2 rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white/6 p-3">
                    <p className="text-xs text-slate-300">
                      {t("mypage.orderDetail.insights.statusTitle")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">{statusLabel}</p>
                  </div>

                  <div className="rounded-2xl bg-white/6 p-3">
                    <p className="text-xs text-slate-300">
                      {t("mypage.orderDetail.insights.shippingTitle")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">{shippingStatusLabel}</p>
                  </div>

                  <div className="rounded-2xl bg-white/6 p-3">
                    <p className="text-xs text-slate-300">
                      {t("mypage.orderDetail.insights.timelineTitle")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {t("mypage.orderDetail.insights.timelineCount", {
                        count: timelineEventCount,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div
                  className={[
                    "rounded-3xl border p-5",
                    insightToneClassMap[customerAction.tone] ?? insightToneClassMap.slate,
                  ].join(" ")}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-80">
                    {t("mypage.orderDetail.insights.customerActionTitle")}
                  </p>
                  <p className="mt-3 text-base font-bold">{customerAction.label}</p>
                  <p className="mt-2 text-sm opacity-90">{customerAction.description}</p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {t("mypage.orderDetail.insights.trackingTitle")}
                  </p>
                  <p className="mt-3 text-base font-bold text-slate-900">
                    {order.trackingNumber
                      ? t("mypage.orderDetail.insights.trackingReady")
                      : t("mypage.orderDetail.insights.trackingPending")}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {order.trackingNumber
                      ? `${order.carrier ?? "-"} · ${order.trackingNumber}`
                      : t("mypage.orderDetail.insights.trackingPendingDescription")}
                  </p>
                </div>
              </div>
            </div>

            <OrderStatusTimeline order={order} lang={lang} />
            <OrderStatusDebugPanel order={order} />

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
                        <Image
                          src={item.product?.images?.[0]}
                          alt={name}
                          width={240}
                          height={240}
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
                    {t("price", {
                      price: formatPrice(totalPrice, lang),
                    })}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  {t("order.payment.title")}: {methodKey && t(`order.payment.methods.${methodKey}`)}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="w-full sm:flex-1 min-w-[180px] px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!order.trackingNumber}
                title={!order.trackingNumber ? t("mypage.orderDetail.actions.trackDisabled") : ""}
                onClick={() => setTrackingOpen(true)}
              >
                {t("mypage.orderDetail.actions.track")}
              </button>

              {(canCancel || canReturn) && (
                <button
                  className="w-full sm:flex-1 min-w-[180px] px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={handleOrderAction}
                >
                  {t(orderActionLabel)}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
      <OrderClaimDialog
        open={open}
        onOpenChange={setOpen}
        mode={mode}
        orderId={Number(order.id)}
        refundAmount={t("price", {
          price: formatPrice(isBank && order.status === "PENDING" ? 0 : totalPrice, lang),
        })}
      />
      <OrderTrackingDialog open={trackingOpen} onOpenChange={setTrackingOpen} order={order} />
    </div>
  );
}
