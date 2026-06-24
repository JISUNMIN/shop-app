"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import useOrder from "@/hooks/useOrder";
import type { LangCode } from "@/types";
import { formatDate, formatPrice } from "@/utils/helper";
import OrdersTabSkeleton from "@/app/mypage/_components/OrdersTabSkeleton";

import {
  ORDER_STATUS_BADGE_CLASS,
  filterOrdersByStatus,
  getOrderAttentionSummary,
  getOrderItemTitle,
  getOrderProgressPercent,
  getOrderStatusLabel,
} from "@/utils/orders";
import OrderEmpty from "../_components/OrderEmpty";

type OrderFilter = "all" | "active" | "delivered" | "claims";

export default function OrdersTab() {
  const router = useRouter();
  const { listData, isListLoading } = useOrder();
  const { i18n, t } = useTranslation();

  const lang = i18n.language as LangCode;
  const [filter, setFilter] = useState<OrderFilter>("all");

  const summary = useMemo(() => {
    const orders = listData ?? [];

    return {
      total: orders.length,
      active: filterOrdersByStatus(orders, "active").length,
      delivered: filterOrdersByStatus(orders, "delivered").length,
      claims: filterOrdersByStatus(orders, "claims").length,
    };
  }, [listData]);

  const toneClassMap: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    amber: "bg-amber-100 text-amber-800 border-amber-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rose: "bg-rose-100 text-rose-700 border-rose-200",
    violet: "bg-violet-100 text-violet-700 border-violet-200",
  };

  const filteredOrders = useMemo(() => {
    if (!listData) return [];
    return filterOrdersByStatus(listData, filter);
  }, [listData, filter]);

  if (isListLoading) {
    return <OrdersTabSkeleton />;
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{t("mypage.orders.title")}</h1>
      {!listData || listData.length === 0 ? (
        <OrderEmpty />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Card className="border-0 bg-slate-950 p-4 text-white shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                {t("mypage.orders.summary.total")}
              </p>
              <p className="mt-3 text-2xl font-bold">{summary.total}</p>
            </Card>

            <Card className="border border-blue-100 bg-blue-50 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
                {t("mypage.orders.summary.active")}
              </p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{summary.active}</p>
            </Card>

            <Card className="border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">
                {t("mypage.orders.summary.delivered")}
              </p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{summary.delivered}</p>
            </Card>

            <Card className="border border-rose-100 bg-rose-50 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-rose-700">
                {t("mypage.orders.summary.claims")}
              </p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{summary.claims}</p>
            </Card>
          </div>

          {/* 필터 */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              size="sm"
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              {t("mypage.orders.filter.all")}
            </Button>

            <Button
              size="sm"
              variant={filter === "active" ? "default" : "outline"}
              onClick={() => setFilter("active")}
            >
              {t("mypage.orders.filter.active")}
            </Button>

            <Button
              size="sm"
              variant={filter === "delivered" ? "default" : "outline"}
              onClick={() => setFilter("delivered")}
            >
              {t("mypage.orders.filter.delivered")}
            </Button>

            <Button
              size="sm"
              variant={filter === "claims" ? "default" : "outline"}
              onClick={() => setFilter("claims")}
            >
              {t("mypage.orders.filter.claims")}
            </Button>
          </div>
        </>
      )}

      {/* 주문 리스트 */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const orderedItems = order.orderItems ?? [];
          if (orderedItems.length === 0) return null;

          const title = getOrderItemTitle(orderedItems, lang, t);
          const attention = getOrderAttentionSummary(order, t);
          const progressPercent = getOrderProgressPercent(order.status);

          return (
            <Card key={order.id} className="overflow-hidden border border-slate-200 bg-white shadow-sm">
              <div className="h-1 bg-slate-100">
                <div
                  className="h-full rounded-r-full bg-slate-900 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{formatDate(order.createdAt, lang)}</p>
                  <p className="text-base md:text-lg font-bold">{title}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t("mypage.orders.orderNumber", { id: order.id })}
                  </p>
                </div>

                <Badge
                  className={ORDER_STATUS_BADGE_CLASS[order.status] ?? "bg-gray-100 text-gray-600"}
                >
                  {getOrderStatusLabel(order.status, t)}
                </Badge>
              </div>

              <div className="mb-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {t("mypage.orders.summary.progressLabel")}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {attention.label}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-slate-500">{progressPercent}%</p>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-900 transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <p className="mt-3 text-sm text-slate-600">{attention.description}</p>
                </div>

                <div
                  className={[
                    "rounded-2xl border p-4",
                    toneClassMap[attention.tone] ?? toneClassMap.slate,
                  ].join(" ")}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                    {t("mypage.orders.summary.attentionTitle")}
                  </p>
                  <p className="mt-2 text-sm font-semibold">{attention.label}</p>
                  <p className="mt-2 text-sm opacity-90">{attention.description}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t gap-3">
                <p className="text-xl md:text-2xl font-bold">
                  {t("price", {
                    price: formatPrice(order.totalAmount ?? 0, lang),
                  })}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/mypage/orders/${order.id}?tab=orders`)}
                >
                  {t("mypage.orders.viewDetail")}
                </Button>
              </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
