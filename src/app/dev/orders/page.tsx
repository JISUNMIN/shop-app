"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { History, Package2, RefreshCcw, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import useOrder from "@/hooks/useOrder";
import type { LangCode, OrderStatus } from "@/types";
import { formatDate, formatPrice } from "@/utils/helper";
import {
  getOrderTransitionRequirement,
  getNextOrderStatuses,
  getOrderItemTitle,
  getOrderStatusLabel,
  ORDER_STATUS_BADGE_CLASS,
} from "@/utils/orders";

type ShippingDraft = {
  carrier: string;
  trackingNumber: string;
};

type TransitionDraft = {
  note: string;
};

const FILTERS: Array<"all" | OrderStatus> = [
  "all",
  "PENDING" as OrderStatus,
  "PAID" as OrderStatus,
  "SHIPPING" as OrderStatus,
  "DELIVERED" as OrderStatus,
  "CANCEL_REQUESTED" as OrderStatus,
  "REFUNDED" as OrderStatus,
  "RETURN_REQUESTED" as OrderStatus,
  "RETURNED" as OrderStatus,
];

export default function DevOrdersPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as LangCode;
  const {
    listData,
    isListLoading,
    refetchList,
    updateOrderStatusMutate,
    isUpdateOrderStatusPending,
    updateOrderShippingMutate,
    isUpdateOrderShippingPending,
  } = useOrder();
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [shippingDrafts, setShippingDrafts] = useState<Record<number, ShippingDraft>>({});
  const [transitionDrafts, setTransitionDrafts] = useState<Record<number, TransitionDraft>>({});

  const filteredOrders = useMemo(() => {
    const orders = listData ?? [];
    if (filter === "all") return orders;
    return orders.filter((order) => order.status === filter);
  }, [filter, listData]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    (listData ?? []).forEach((order) => {
      map.set(order.status, (map.get(order.status) ?? 0) + 1);
    });
    return map;
  }, [listData]);

  const getShippingDraft = (
    orderId: number,
    carrier?: string | null,
    trackingNumber?: string | null,
  ) => {
    return (
      shippingDrafts[orderId] ?? {
        carrier: carrier ?? "",
        trackingNumber: trackingNumber ?? "",
      }
    );
  };

  const updateShippingDraft = (
    orderId: number,
    key: keyof ShippingDraft,
    value: string,
    carrier?: string | null,
    trackingNumber?: string | null,
  ) => {
    const base = getShippingDraft(orderId, carrier, trackingNumber);
    setShippingDrafts((prev) => ({
      ...prev,
      [orderId]: {
        ...base,
        [key]: value,
      },
    }));
  };

  const getTransitionDraft = (orderId: number) => {
    return transitionDrafts[orderId] ?? { note: "" };
  };

  const updateTransitionDraft = (orderId: number, value: string) => {
    setTransitionDrafts((prev) => ({
      ...prev,
      [orderId]: {
        note: value,
      },
    }));
  };

  if (process.env.NODE_ENV === "production") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Card className="p-6">
          <h1 className="text-xl font-semibold">{t("devOrders.unavailableTitle")}</h1>
          <p className="mt-2 text-sm text-gray-600">{t("devOrders.unavailableDesc")}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
            <Package2 className="h-3.5 w-3.5" />
            {t("devOrders.badge")}
          </div>
          <h1 className="mt-3 text-2xl font-bold">{t("devOrders.title")}</h1>
          <p className="mt-1 text-sm text-gray-600">{t("devOrders.description")}</p>
        </div>

        <Button variant="outline" onClick={() => refetchList()} disabled={isListLoading}>
          <RefreshCcw className="h-4 w-4" />
          {t("devOrders.refresh")}
        </Button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((status) => {
          const active = filter === status;
          const label =
            status === "all" ? t("devOrders.filters.all") : getOrderStatusLabel(status, t);
          const count = status === "all" ? listData?.length ?? 0 : counts.get(status) ?? 0;

          return (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={[
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                active
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
              ].join(" ")}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => {
          const title = getOrderItemTitle(order.orderItems, lang, t);
          const nextStatuses = getNextOrderStatuses(order.status);
          const canFillShipping = order.status === "SHIPPING" || order.status === "DELIVERED";
          const shippingDraft = getShippingDraft(order.id, order.carrier, order.trackingNumber);
          const transitionDraft = getTransitionDraft(order.id);
          const hasShippingInfo = Boolean(
            (shippingDraft.carrier || order.carrier) &&
              (shippingDraft.trackingNumber || order.trackingNumber),
          );
          const needsOperatorNote = nextStatuses.some(
            (status) => getOrderTransitionRequirement(status).requiresNote,
          );
          const needsShippingBeforeTransition = nextStatuses.some(
            (status) => getOrderTransitionRequirement(status).requiresShipping,
          );

          return (
            <Card key={order.id} className="gap-0 overflow-hidden p-0">
              <div className="border-b px-5 py-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold">{title}</h2>
                      <Badge
                        className={
                          ORDER_STATUS_BADGE_CLASS[order.status] ?? "bg-gray-100 text-gray-700"
                        }
                      >
                        {getOrderStatusLabel(order.status, t)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      #{order.id} · {formatDate(order.createdAt, lang)}
                    </p>
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="text-sm text-gray-500">{t("devOrders.totalLabel")}</p>
                    <p className="text-lg font-bold">
                      {t("price", { price: formatPrice(order.totalAmount ?? 0, lang) })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t("devOrders.nextTitle")}</p>
                    {nextStatuses.length === 0 ? (
                      <p className="mt-1 text-sm text-gray-500">{t("devOrders.noNext")}</p>
                    ) : (
                      <div className="mt-2 space-y-3">
                        {needsOperatorNote && (
                          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                            <p className="text-xs font-medium text-amber-900">
                              {t("devOrders.noteTitle")}
                            </p>
                            <p className="mt-1 text-xs text-amber-800">
                              {t("devOrders.noteDescription")}
                            </p>
                            <Textarea
                              className="mt-2 min-h-24 bg-white"
                              value={transitionDraft.note}
                              placeholder={t("devOrders.notePlaceholder")}
                              onChange={(e) => updateTransitionDraft(order.id, e.target.value)}
                            />
                          </div>
                        )}

                        {needsShippingBeforeTransition && !hasShippingInfo && (
                          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                            {t("devOrders.shippingRequiredHint")}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {nextStatuses.map((status) => {
                            const requirement = getOrderTransitionRequirement(status);
                            const disabled =
                              isUpdateOrderStatusPending ||
                              (requirement.requiresShipping && !hasShippingInfo) ||
                              (requirement.requiresNote && !transitionDraft.note.trim());

                            return (
                              <Button
                                key={status}
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={disabled}
                                onClick={() =>
                                  updateOrderStatusMutate({
                                    id: order.id,
                                    nextStatus: status,
                                    note: transitionDraft.note.trim() || null,
                                  })
                                }
                              >
                                {t("devOrders.moveTo", {
                                  status: getOrderStatusLabel(status, t),
                                })}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gray-500" />
                        <p className="text-sm font-medium text-gray-900">
                          {t("devOrders.shippingTitle")}
                        </p>
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <Input
                          value={shippingDraft.carrier}
                          placeholder={t("devOrders.shippingCarrier")}
                          onChange={(e) =>
                            updateShippingDraft(
                              order.id,
                              "carrier",
                              e.target.value,
                              order.carrier,
                              order.trackingNumber,
                            )
                          }
                        />
                        <Input
                          value={shippingDraft.trackingNumber}
                          placeholder={t("devOrders.shippingTracking")}
                          onChange={(e) =>
                            updateShippingDraft(
                              order.id,
                              "trackingNumber",
                              e.target.value,
                              order.carrier,
                              order.trackingNumber,
                            )
                          }
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {canFillShipping && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isUpdateOrderShippingPending}
                            onClick={() =>
                              updateOrderShippingMutate({
                                id: order.id,
                                carrier: shippingDraft.carrier || null,
                                trackingNumber: shippingDraft.trackingNumber || null,
                              })
                            }
                          >
                            {t("devOrders.saveShipping")}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isUpdateOrderShippingPending}
                          onClick={() =>
                            setShippingDrafts((prev) => ({
                              ...prev,
                              [order.id]: {
                                carrier: "CJ대한통운",
                                trackingNumber: `RB-${order.id}-20260623`,
                              },
                            }))
                          }
                        >
                          {t("devOrders.fillShipping")}
                        </Button>
                        <Link href={`/mypage/orders/${order.id}`}>
                          <Button size="sm">{t("devOrders.viewDetail")}</Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-gray-500" />
                      <p className="text-sm font-medium text-gray-900">
                        {t("devOrders.eventsTitle")}
                      </p>
                    </div>

                    <div className="mt-3 space-y-3">
                      {(order.orderEvents ?? []).length === 0 ? (
                        <p className="text-sm text-gray-500">{t("devOrders.eventsEmpty")}</p>
                      ) : (
                        order.orderEvents?.map((event, index) => (
                          <div key={event.id}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {event.eventType}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(event.createdAt, lang)}
                                </p>
                                {event.note && (
                                  <p className="mt-1 text-xs text-gray-500">{event.note}</p>
                                )}
                              </div>
                              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600">
                                {getOrderStatusLabel(event.toStatus, t)}
                              </span>
                            </div>
                            {index !== (order.orderEvents?.length ?? 0) - 1 && (
                              <Separator className="mt-3" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {!isListLoading && filteredOrders.length === 0 && (
          <Card className="p-6 text-sm text-gray-600">{t("devOrders.empty")}</Card>
        )}
      </div>
    </div>
  );
}
