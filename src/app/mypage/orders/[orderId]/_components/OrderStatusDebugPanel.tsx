"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types";
import useOrder from "@/hooks/useOrder";
import { getNextOrderStatuses, getOrderStatusLabel } from "@/utils/orders";

export default function OrderStatusDebugPanel({ order }: { order: Order }) {
  const { t } = useTranslation();
  const { updateOrderStatusMutate, isUpdateOrderStatusPending } = useOrder(order.id);
  const nextStatuses = getNextOrderStatuses(order.status);

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Card className="mb-6 sm:mb-8 border-dashed border-amber-300 bg-amber-50/70 p-4 sm:p-5">
      <div className="space-y-2">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-amber-900">
              {t("mypage.orderDetail.debug.title")}
            </h2>
            <p className="text-sm text-amber-800">
              {t("mypage.orderDetail.debug.description")}
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-amber-800">
            {t("mypage.orderDetail.debug.current", {
              status: getOrderStatusLabel(order.status, t),
            })}
          </span>
        </div>

        {nextStatuses.length === 0 ? (
          <p className="text-sm text-amber-800">{t("mypage.orderDetail.debug.noNext")}</p>
        ) : (
          <div className="flex flex-wrap gap-2 pt-2">
            {nextStatuses.map((status) => (
              <Button
                key={status}
                type="button"
                variant="outline"
                className="border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
                disabled={isUpdateOrderStatusPending}
                onClick={() => updateOrderStatusMutate({ id: order.id, nextStatus: status })}
              >
                {t("mypage.orderDetail.debug.moveTo", {
                  status: getOrderStatusLabel(status, t),
                })}
              </Button>
            ))}
          </div>
        )}

        <div className="pt-2">
          <Link
            href="/dev/orders"
            className="text-sm font-medium text-amber-900 underline underline-offset-4"
          >
            {t("mypage.orderDetail.debug.viewAllOrders")}
          </Link>
        </div>
      </div>
    </Card>
  );
}
