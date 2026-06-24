"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ClipboardList, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import useOpsOrderDetail from "@/hooks/useOpsOrderDetail";
import type { LangCode, OrderPriority, OrderStatus } from "@/types";
import { formatDate, formatPrice } from "@/utils/helper";
import {
  getNextOrderStatuses,
  getOrderStatusLabel,
  getOrderTimelineEntries,
  getOrderTransitionRequirement,
  getShipMemoText,
  getShippingStatusLabel,
  ORDER_MAIN_FLOW,
  ORDER_STATUS_BADGE_CLASS,
} from "@/utils/orders";
import { ORDER_PRIORITY_BADGE_CLASS } from "@/lib/opsOrders";

const STEP_STYLE = {
  done: "border-emerald-200 bg-emerald-50 text-emerald-700",
  current: "border-blue-200 bg-blue-50 text-blue-700",
  upcoming: "border-gray-200 bg-gray-50 text-gray-500",
} as const;

const EVENT_TONE_STYLE = {
  neutral: "bg-gray-300",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
} as const;

function getOrderStepState(currentStatus: OrderStatus, targetStatus: OrderStatus) {
  const currentIndex = ORDER_MAIN_FLOW.indexOf(currentStatus);
  const targetIndex = ORDER_MAIN_FLOW.indexOf(targetStatus);

  if (currentIndex === -1 || targetIndex === -1) return "upcoming" as const;
  if (targetIndex < currentIndex) return "done" as const;
  if (targetIndex === currentIndex) return "current" as const;
  return "upcoming" as const;
}

export default function OpsOrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ orderId: string }>();
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const lang = i18n.language as LangCode;
  const currentOperator =
    session?.user?.name || session?.user?.userId || session?.user?.email || "";
  const orderId = Number(params.orderId);
  const {
    detailData,
    isDetailLoading,
    isDetailFetching,
    refetchDetail,
    updateOpsOrderDetailMutate,
    isUpdateOpsOrderDetailPending,
  } = useOpsOrderDetail(orderId);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [note, setNote] = useState("");
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [assignedOperator, setAssignedOperator] = useState("");
  const [priority, setPriority] = useState<OrderPriority>("NORMAL");
  const [slaDueAt, setSlaDueAt] = useState("");
  const [internalMemo, setInternalMemo] = useState("");

  const availableNextStatuses = useMemo(() => {
    if (!detailData) return [] as OrderStatus[];
    return getNextOrderStatuses(detailData.status);
  }, [detailData]);

  useEffect(() => {
    if (!detailData) return;

    setCarrier(detailData.carrier ?? "");
    setTrackingNumber(detailData.trackingNumber ?? "");
    setAssignedOperator(detailData.assignedOperator ?? "");
    setPriority(detailData.priority);
    setSlaDueAt(detailData.slaDueAt ? String(detailData.slaDueAt).slice(0, 16) : "");
    setInternalMemo(detailData.internalMemo ?? "");
  }, [detailData]);

  useEffect(() => {
    if (availableNextStatuses.length === 0) {
      setSelectedStatus("");
      return;
    }

    if (!selectedStatus || !availableNextStatuses.includes(selectedStatus)) {
      setSelectedStatus(availableNextStatuses[0]);
    }
  }, [availableNextStatuses, selectedStatus]);

  if (isDetailLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Card className="border-slate-200 p-8 text-slate-500">
          {t("opsOrderDetail.loading")}
        </Card>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Card className="border-slate-200 p-8 text-slate-500">
          {t("opsOrderDetail.notFound")}
        </Card>
      </div>
    );
  }

  const timelineEntries = getOrderTimelineEntries(detailData, lang, t);
  const eventLogs = detailData.orderEvents ?? [];
  const shipMemoText = getShipMemoText(detailData.shipMemo, t);
  const selectedRequirement = selectedStatus
    ? getOrderTransitionRequirement(selectedStatus)
    : { requiresShipping: false, requiresNote: false };
  const canApplyStatus =
    !!selectedStatus &&
    (!selectedRequirement.requiresShipping || Boolean(carrier && trackingNumber)) &&
    (!selectedRequirement.requiresNote || Boolean(note.trim()));

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
      <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#132238_52%,#1f4b6e_100%)] p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <button
              type="button"
              onClick={() => router.push("/ops/orders")}
              className="inline-flex items-center gap-2 text-sm text-slate-200 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("opsOrderDetail.backToBoard")}
            </button>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t("opsOrderDetail.badge")}
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              {t("opsOrderDetail.title", { id: detailData.id })}
            </h1>
            <p className="mt-2 text-sm text-slate-200">
              {detailData.user.name || t("opsOrders.unknownCustomer")} ·{" "}
              {detailData.user.userId || detailData.user.email || detailData.user.id}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className={ORDER_STATUS_BADGE_CLASS[detailData.status]}>
              {getOrderStatusLabel(detailData.status, t)}
            </Badge>
            <Badge className={ORDER_PRIORITY_BADGE_CLASS[detailData.priority]}>
              {t(`opsOrders.priority.${detailData.priority}`)}
            </Badge>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              onClick={() => refetchDetail()}
              disabled={isDetailFetching}
            >
              <RefreshCcw className="h-4 w-4" />
              {t("opsOrderDetail.refresh")}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-200">
          <span>{t("opsOrderDetail.orderedAt", { date: formatDate(detailData.createdAt, lang) })}</span>
          <span>{t("opsOrderDetail.totalPrice", { price: formatPrice(detailData.totalAmount, lang) })}</span>
          <span>{t("opsOrderDetail.paymentMethod", { method: detailData.paymentMethod ?? "-" })}</span>
        </div>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>{t("opsOrderDetail.timelineTitle")}</CardTitle>
          <CardDescription>
            {t("opsOrderDetail.currentStatus", {
              status: getOrderStatusLabel(detailData.status, t),
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
            {ORDER_MAIN_FLOW.map((status) => {
              const stepState = getOrderStepState(detailData.status, status);

              return (
                <div key={status} className={`rounded-xl border px-4 py-3 ${STEP_STYLE[stepState]}`}>
                  <div className="text-xs font-medium uppercase tracking-wide opacity-70">
                    {stepState === "current"
                      ? t("mypage.orderDetail.timeline.currentStep")
                      : stepState === "done"
                        ? t("mypage.orderDetail.timeline.doneStep")
                        : t("mypage.orderDetail.timeline.upcomingStep")}
                  </div>
                  <div className="mt-1 text-sm font-semibold">{getOrderStatusLabel(status, t)}</div>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            {timelineEntries.map((entry) => (
              <div key={entry.key} className="flex items-start gap-3">
                <div className={`mt-1.5 h-2.5 w-2.5 rounded-full ${EVENT_TONE_STYLE[entry.tone]}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{entry.label}</p>
                  <p className="text-xs text-slate-500">
                    {entry.date ?? t("mypage.orderDetail.timeline.awaitingUpdate")}
                  </p>
                  {entry.note && <p className="mt-1 text-xs text-slate-600">{entry.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.9fr)]">
        <div className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>{t("opsOrderDetail.itemsTitle")}</CardTitle>
              <CardDescription>{t("opsOrderDetail.itemsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {detailData.orderItems.map((item) => {
                const productName = item.product.name?.[lang] ?? "-";
                const image = item.product.images?.[0];

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row"
                  >
                    <div className="h-32 w-full overflow-hidden rounded-lg bg-slate-100 sm:h-24 sm:w-24">
                      {image ? (
                        <Image
                          src={image}
                          alt={productName}
                          width={240}
                          height={240}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">
                          N/A
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{productName}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {t("opsOrderDetail.quantity", { count: item.quantity })}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {t("price", { price: formatPrice(item.price * item.quantity, lang) })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>{t("opsOrderDetail.customerTitle")}</CardTitle>
                <CardDescription>{t("opsOrderDetail.customerDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-500">{t("opsOrderDetail.customerName")}</p>
                  <p className="font-medium text-slate-900">
                    {detailData.user.name || t("opsOrders.unknownCustomer")}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">{t("opsOrderDetail.customerAccount")}</p>
                  <p className="font-medium text-slate-900">
                    {detailData.user.userId || detailData.user.email || detailData.user.id}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">{t("opsOrderDetail.customerPhone")}</p>
                  <p className="font-medium text-slate-900">
                    {detailData.user.phone || detailData.shipPhone || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">{t("opsOrderDetail.customerEmail")}</p>
                  <p className="font-medium text-slate-900">{detailData.user.email || "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>{t("opsOrderDetail.shippingAddressTitle")}</CardTitle>
                <CardDescription>{t("opsOrderDetail.shippingAddressDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-500">{t("opsOrderDetail.recipientName")}</p>
                  <p className="font-medium text-slate-900">{detailData.shipName}</p>
                </div>
                <div>
                  <p className="text-slate-500">{t("opsOrderDetail.recipientPhone")}</p>
                  <p className="font-medium text-slate-900">{detailData.shipPhone}</p>
                </div>
                <div>
                  <p className="text-slate-500">{t("opsOrderDetail.address")}</p>
                  <div className="font-medium text-slate-900">
                    {detailData.shipZip && <p>[{detailData.shipZip}]</p>}
                    <p>{detailData.shipAddress1}</p>
                    {detailData.shipAddress2 && <p>{detailData.shipAddress2}</p>}
                  </div>
                </div>
                <div>
                  <p className="text-slate-500">{t("opsOrderDetail.deliveryMemo")}</p>
                  <p className="font-medium text-slate-900">{shipMemoText}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>{t("opsOrderDetail.claimTitle")}</CardTitle>
              <CardDescription>{t("opsOrderDetail.claimDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-900">{t("opsOrderDetail.cancelRequest")}</p>
                <p className="mt-2 text-xs text-slate-500">{t("opsOrderDetail.reason")}</p>
                <p className="mt-1 text-sm text-slate-900">{detailData.cancelReason || "-"}</p>
                <p className="mt-3 text-xs text-slate-500">{t("opsOrderDetail.memo")}</p>
                <p className="mt-1 text-sm text-slate-900">{detailData.cancelMemo || "-"}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-900">{t("opsOrderDetail.returnRequest")}</p>
                <p className="mt-2 text-xs text-slate-500">{t("opsOrderDetail.reason")}</p>
                <p className="mt-1 text-sm text-slate-900">{detailData.returnReason || "-"}</p>
                <p className="mt-3 text-xs text-slate-500">{t("opsOrderDetail.memo")}</p>
                <p className="mt-1 text-sm text-slate-900">{detailData.returnMemo || "-"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>{t("opsOrderDetail.opsMetaTitle")}</CardTitle>
              <CardDescription>{t("opsOrderDetail.opsMetaDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {currentOperator && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isUpdateOpsOrderDetailPending}
                    onClick={() => setAssignedOperator(currentOperator)}
                  >
                    {t("opsOrders.assignToMe")}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isUpdateOpsOrderDetailPending}
                  onClick={() => {
                    const next = new Date(Date.now() + 1000 * 60 * 60 * 24);
                    setSlaDueAt(next.toISOString().slice(0, 16));
                  }}
                >
                  {t("opsOrders.slaPlus1d")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isUpdateOpsOrderDetailPending}
                  onClick={() => {
                    const next = new Date(Date.now() + 1000 * 60 * 60 * 48);
                    setSlaDueAt(next.toISOString().slice(0, 16));
                  }}
                >
                  {t("opsOrders.slaPlus2d")}
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">{t("opsOrderDetail.assignedOperator")}</p>
                <Input value={assignedOperator} onChange={(e) => setAssignedOperator(e.target.value)} />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">{t("opsOrderDetail.priority")}</p>
                <Select value={priority} onValueChange={(value) => setPriority(value as OrderPriority)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("opsOrderDetail.priorityPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {(["LOW", "NORMAL", "HIGH", "URGENT"] as OrderPriority[]).map((item) => (
                      <SelectItem key={item} value={item}>
                        {t(`opsOrders.priority.${item}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">{t("opsOrderDetail.slaDueAt")}</p>
                <Input type="datetime-local" value={slaDueAt} onChange={(e) => setSlaDueAt(e.target.value)} />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">{t("opsOrderDetail.internalMemo")}</p>
                <Textarea
                  className="min-h-24"
                  value={internalMemo}
                  placeholder={t("opsOrderDetail.internalMemoPlaceholder")}
                  onChange={(e) => setInternalMemo(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="w-full"
                disabled={isUpdateOpsOrderDetailPending}
                onClick={() =>
                  updateOpsOrderDetailMutate({
                    id: detailData.id,
                    assignedOperator: assignedOperator || null,
                    priority,
                    slaDueAt: slaDueAt || null,
                    internalMemo: internalMemo || null,
                  })
                }
              >
                {t("opsOrderDetail.saveOpsMeta")}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>{t("opsOrderDetail.actionsTitle")}</CardTitle>
              <CardDescription>{t("opsOrderDetail.actionsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">{t("opsOrderDetail.nextStatus")}</p>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
                  disabled={availableNextStatuses.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("opsOrderDetail.nextStatusPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableNextStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {getOrderStatusLabel(status, t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">{t("opsOrderDetail.operatorNote")}</p>
                <Textarea
                  className="min-h-28"
                  value={note}
                  placeholder={t("opsOrderDetail.operatorNotePlaceholder")}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {(selectedRequirement.requiresNote || selectedRequirement.requiresShipping) && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                  {selectedRequirement.requiresShipping && (
                    <p>{t("opsOrderDetail.shippingRequirement")}</p>
                  )}
                  {selectedRequirement.requiresNote && <p>{t("opsOrderDetail.noteRequirement")}</p>}
                </div>
              )}

              <Button
                className="w-full"
                disabled={!canApplyStatus || isUpdateOpsOrderDetailPending}
                onClick={() => {
                  if (!selectedStatus) return;
                  updateOpsOrderDetailMutate({
                    id: detailData.id,
                    nextStatus: selectedStatus,
                    note: note.trim() || null,
                  });
                }}
              >
                {selectedStatus
                  ? t("opsOrderDetail.applyStatus", {
                      status: getOrderStatusLabel(selectedStatus, t),
                    })
                  : t("opsOrderDetail.noStatusAvailable")}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>{t("opsOrderDetail.shippingOpsTitle")}</CardTitle>
              <CardDescription>
                {t("opsOrderDetail.shippingOpsDescription", {
                  status: getShippingStatusLabel(detailData.status, t),
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">{t("opsOrderDetail.shippingCarrier")}</p>
                <Input value={carrier} onChange={(e) => setCarrier(e.target.value)} />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">{t("opsOrderDetail.shippingTracking")}</p>
                <Input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    updateOpsOrderDetailMutate({
                      id: detailData.id,
                      carrier: carrier || null,
                      trackingNumber: trackingNumber || null,
                    })
                  }
                  disabled={isUpdateOpsOrderDetailPending}
                >
                  <Truck className="h-4 w-4" />
                  {t("opsOrderDetail.saveShipping")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCarrier("CJ대한통운");
                    setTrackingNumber(`OPS-${detailData.id}-DETAIL`);
                  }}
                  disabled={isUpdateOpsOrderDetailPending}
                >
                  {t("opsOrderDetail.fillSampleShipping")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>{t("opsOrderDetail.eventsTitle")}</CardTitle>
              <CardDescription>{t("opsOrderDetail.eventsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {eventLogs.length === 0 ? (
                <p className="text-sm text-slate-500">{t("opsOrderDetail.eventsEmpty")}</p>
              ) : (
                eventLogs.map((event, index) => (
                  <div key={event.id}>
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-slate-400" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-medium text-slate-900">{event.eventType}</p>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600">
                            {getOrderStatusLabel(event.toStatus, t)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{formatDate(event.createdAt, lang)}</p>
                        {event.note && <p className="mt-2 text-xs leading-5 text-slate-600">{event.note}</p>}
                      </div>
                    </div>
                    {index !== eventLogs.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>{t("opsOrderDetail.quickLinksTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Link href="/ops/orders">
                <Button variant="outline">
                  <ClipboardList className="h-4 w-4" />
                  {t("opsOrderDetail.backToBoard")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
