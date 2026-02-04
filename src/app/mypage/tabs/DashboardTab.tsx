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
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{t("mypage.dashboard.title")}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <Package className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90">{t("mypage.dashboard.orders")}</p>
          <p className="text-3xl font-bold mt-1">
            {t("mypage.dashboard.ordersCount", { count: orderList?.length ?? 0 })}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <Gift className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90">{t("mypage.dashboard.availableCoupons")}</p>
          <p className="text-3xl font-bold mt-1">
            {t("mypage.dashboard.couponsCount", {
              count: typeof availableCouponCount === "number" ? availableCouponCount : 0,
            })}
          </p>
        </Card>
      </div>

      <h2 className="text-lg md:text-xl font-bold mb-4">{t("mypage.dashboard.recentOrders")}</h2>

      <div className="space-y-3">
        {orderList?.slice(0, 3).map((order) => {
          const productName = getOrderItemTitle(order.orderItems, lang, t);
          const orderDate = formatDate(order.createdAt, lang);

          const statusLabel = getOrderStatusLabel(order.status, t);
          const badgeClass = ORDER_STATUS_BADGE_CLASS[order.status] ?? "bg-gray-100 text-gray-700";

          return (
            <Card key={order.id} className="p-4 bg-gray-50">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{productName}</p>
                  <p className="text-sm text-gray-500">
                    {orderDate} · #{order.id}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold">
                    {t("mypage.dashboard.won", { amount: order.totalAmount.toLocaleString() })}
                  </p>

                  <Badge className={badgeClass}>{statusLabel}</Badge>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
