"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import useOrder from "@/hooks/useOrder";
import type { LangCode } from "@/types";
import { formatDate } from "@/utils/helper";

type OrderFilter = "all" | "active" | "delivered" | "claims";

export default function OrdersTab() {
  const router = useRouter();
  const { listData, isListLoading } = useOrder();
  const { i18n, t } = useTranslation();

  const lang = i18n.language as LangCode;
  const [filter, setFilter] = useState<OrderFilter>("all");

  const statusLabelMap = useMemo<Record<string, string>>(
    () => ({
      PAID: t("order.status.paid"),
      SHIPPING: t("order.status.shipping"),
      DELIVERED: t("order.status.delivered"),
      CANCEL_REQUESTED: t("order.status.cancelRequested"),
      REFUNDED: t("order.status.refunded"),
      RETURN_REQUESTED: t("order.status.returnRequested"),
      RETURNED: t("order.status.returned"),
    }),
    [t],
  );

  const statusColorMap: Record<string, string> = {
    PAID: "bg-green-500",
    SHIPPING: "bg-blue-500",
    DELIVERED: "bg-gray-500",

    CANCEL_REQUESTED: "bg-orange-500",
    REFUNDED: "bg-red-500",

    RETURN_REQUESTED: "bg-purple-500",
    RETURNED: "bg-zinc-700",
  };

  const filteredOrders = useMemo(() => {
    if (!listData) return [];

    switch (filter) {
      case "active":
        return listData.filter((o: any) => ["PAID", "SHIPPING"].includes(o.status));

      case "delivered":
        return listData.filter((o: any) => o.status === "DELIVERED");

      case "claims":
        return listData.filter((o: any) =>
          ["CANCEL_REQUESTED", "REFUNDED", "RETURN_REQUESTED", "RETURNED"].includes(o.status),
        );

      default:
        return listData;
    }
  }, [listData, filter]);

  if (isListLoading) {
    return <p className="text-gray-500">{t("mypage.orders.loading")}</p>;
  }

  if (!listData || listData.length === 0) {
    return <p className="text-gray-500">{t("mypage.orders.empty")}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{t("mypage.orders.title")}</h1>

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

      {/* 주문 리스트 */}
      <div className="space-y-4">
        {filteredOrders.map((order: any) => {
          const orderedItems = order.orderItems ?? [];
          if (orderedItems.length === 0) return null;

          const firstItem = orderedItems[0];
          const productName = firstItem.product?.name?.[lang] ?? "";

          const extraCount = orderedItems.length - 1;
          const title =
            extraCount > 0
              ? t("mypage.orders.itemSummary", { name: productName, count: extraCount })
              : productName;

          return (
            <Card key={order.id} className="p-4 md:p-6 bg-gray-50">
              {/* 상단 */}
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{formatDate(order.createdAt, lang)}</p>

                  <p className="text-base md:text-lg font-bold">{title}</p>

                  <p className="text-sm text-gray-600 mt-1">
                    {t("mypage.orders.orderNumber", { id: order.id })}
                  </p>
                </div>

                <Badge className={statusColorMap[order.status] ?? "bg-gray-400"}>
                  {statusLabelMap[order.status] ?? order.status}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t gap-3">
                <p className="text-xl md:text-2xl font-bold">
                  {Number(order.totalAmount ?? 0).toLocaleString()}
                  {t("order.common.won")}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/mypage/orders/${order.id}`)}
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
