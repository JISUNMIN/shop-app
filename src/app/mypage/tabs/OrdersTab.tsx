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
  getOrderItemTitle,
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
        {filteredOrders.map((order: any) => {
          const orderedItems = order.orderItems ?? [];
          if (orderedItems.length === 0) return null;

          const title = getOrderItemTitle(orderedItems, lang, t);

          return (
            <Card key={order.id} className="p-4 md:p-6 bg-gray-50">
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
            </Card>
          );
        })}
      </div>
    </div>
  );
}
