"use client";

import { Package, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useOrder from "@/hooks/useOrder";
import useCoupon from "@/hooks/useCoupon";
import { useTranslation } from "react-i18next";
import { LangCode } from "@/types";
import { getOrderItemTitle, getOrderStatusLabel, ORDER_STATUS_BADGE_CLASS } from "@/utils/orders";
import { formatDate } from "@/utils/helper";
import DashboardTabSkeleton from "@/app/mypage/_components/DashboardTabSkeleton";

export default function DashboardTab() {
  const { listData: orderList, isListLoading: isOrderLoading } = useOrder();
  const { listData: couponList, isListLoading: isCouponLoading } = useCoupon();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as LangCode;
  const isLoading = isOrderLoading || isCouponLoading;

  const availableCouponCount = couponList?.filter((c) => c.status === "AVAILABLE").length ?? "-";

  if (isLoading) return <DashboardTabSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          {t("mypage.dashboard.title")}
        </h1>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          className="p-5 sm:p-6 border shadow-sm"
          style={{
            background: "color-mix(in oklch, var(--button-bg) 4%, white)",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-gray-500">{t("mypage.dashboard.orders")}</p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight">
                {t("mypage.dashboard.ordersCount", {
                  count: orderList?.length ?? 0,
                })}
              </p>
            </div>

            <div
              className="h-11 w-11 rounded-xl flex items-center justify-center"
              style={{
                background: "color-mix(in oklch, var(--button-bg) 14%, transparent)",
                border: "1px solid color-mix(in oklch, var(--button-bg) 22%, transparent)",
              }}
            >
              <Package className="h-5 w-5" style={{ color: "var(--button-bg)" }} />
            </div>
          </div>
        </Card>

        <Card
          className="p-5 sm:p-6 border shadow-sm"
          style={{
            background: "color-mix(in oklch, var(--button-bg) 4%, white)",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-gray-500">{t("mypage.dashboard.availableCoupons")}</p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight">
                {t("mypage.dashboard.couponsCount", {
                  count: typeof availableCouponCount === "number" ? availableCouponCount : 0,
                })}
              </p>
            </div>

            <div
              className="h-11 w-11 rounded-xl flex items-center justify-center"
              style={{
                background: "color-mix(in oklch, var(--button-bg) 14%, transparent)",
                border: "1px solid color-mix(in oklch, var(--button-bg) 22%, transparent)",
              }}
            >
              <Gift className="h-5 w-5" style={{ color: "var(--button-bg)" }} />
            </div>
          </div>
        </Card>
      </div>

      <h2 className="text-lg md:text-xl font-bold mb-4">{t("mypage.dashboard.recentOrders")}</h2>

      {/* 최근 주문 */}
      <div className="space-y-3">
        {orderList?.slice(0, 3).map((order) => {
          const productName = getOrderItemTitle(order.orderItems, lang, t);
          const orderDate = formatDate(order.createdAt, lang);
          const statusLabel = getOrderStatusLabel(order.status, t);
          const badgeClass = ORDER_STATUS_BADGE_CLASS[order.status] ?? "bg-gray-100 text-gray-700";

          return (
            <Card
              key={order.id}
              className="p-4 border bg-gray-50 shadow-sm transition hover:shadow-md"
              style={{
                boxShadow: "0 1px 0 0 color-mix(in oklch, var(--button-bg) 10%, transparent)",
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{productName}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {orderDate} · #{order.id}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-extrabold">
                    {t("mypage.dashboard.won", {
                      amount: order.totalAmount.toLocaleString(),
                    })}
                  </p>

                  <div className="mt-2 flex justify-end">
                    <Badge className={badgeClass}>{statusLabel}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
