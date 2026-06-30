"use client";
import Link from "next/link";
import { startTransition, useDeferredValue, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Activity,
  AlertTriangle,
  Boxes,
  Clock3,
  ExternalLink,
  PackageSearch,
  RefreshCcw,
  Radio,
  ShieldCheck,
  Siren,
  Truck,
} from "lucide-react";
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
import useOpsOrders from "@/hooks/useOpsOrders";
import type { LangCode, OperatorOrder, OrderPriority, OrderStatus } from "@/types";
import { formatDate, formatPrice } from "@/utils/helper";
import {
  getNextOrderStatuses,
  getOrderItemTitle,
  getOrderStatusLabel,
  getOrderTransitionRequirement,
  ORDER_STATUS_BADGE_CLASS,
} from "@/utils/orders";
import {
  getOrderPriorityWeight,
  getSlaStatus,
  ORDER_PRIORITY_BADGE_CLASS,
  ORDER_SLA_BADGE_CLASS,
} from "@/lib/opsOrders";

type ShippingDraft = {
  carrier: string;
  trackingNumber: string;
};

type NoteDraft = {
  note: string;
};

type OpsMetaDraft = {
  assignedOperator: string;
  priority: OrderPriority;
  slaDueAt: string;
  internalMemo: string;
};

type QueuePreset = "all" | "urgent" | "overdue" | "claims" | "unassigned" | "mine";
type SortOption = "latest" | "priority" | "sla";

const PRIORITY_OPTIONS: OrderPriority[] = ["LOW", "NORMAL", "HIGH", "URGENT"];

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

function matchesQueuePreset(order: OperatorOrder, preset: QueuePreset, currentOperator: string) {
  if (preset === "all") return true;
  if (preset === "urgent") return order.priority === "URGENT";
  if (preset === "overdue") return getSlaStatus(order.slaDueAt) === "overdue";
  if (preset === "claims") {
    return order.status === "CANCEL_REQUESTED" || order.status === "RETURN_REQUESTED";
  }
  if (preset === "unassigned") return !order.assignedOperator;
  if (preset === "mine") {
    return Boolean(
      currentOperator &&
        order.assignedOperator &&
        order.assignedOperator.toLowerCase() === currentOperator.toLowerCase(),
    );
  }
  return true;
}

function sortOrders(orders: OperatorOrder[], sort: SortOption) {
  const copy = [...orders];

  copy.sort((a, b) => {
    if (sort === "priority") {
      const priorityDiff = getOrderPriorityWeight(b.priority) - getOrderPriorityWeight(a.priority);
      if (priorityDiff !== 0) return priorityDiff;
    }

    if (sort === "sla") {
      const aTime = a.slaDueAt ? new Date(a.slaDueAt).getTime() : Number.POSITIVE_INFINITY;
      const bTime = b.slaDueAt ? new Date(b.slaDueAt).getTime() : Number.POSITIVE_INFINITY;
      if (aTime !== bTime) return aTime - bTime;
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return copy;
}

export default function OpsOrdersPage() {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const lang = i18n.language as LangCode;
  const currentOperator =
    session?.user?.name || session?.user?.userId || session?.user?.email || "";
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [queuePreset, setQueuePreset] = useState<QueuePreset>("all");
  const [priorityFilter, setPriorityFilter] = useState<OrderPriority | "all">("all");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [sort, setSort] = useState<SortOption>("latest");
  const [searchInput, setSearchInput] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [shippingDrafts, setShippingDrafts] = useState<Record<number, ShippingDraft>>({});
  const [noteDrafts, setNoteDrafts] = useState<Record<number, NoteDraft>>({});
  const [opsMetaDrafts, setOpsMetaDrafts] = useState<Record<number, OpsMetaDraft>>({});
  const deferredSearch = useDeferredValue(searchInput.trim());
  const deferredAssigneeFilter = useDeferredValue(assigneeFilter.trim().toLowerCase());
  const {
    dashboardData,
    isDashboardLoading,
    isDashboardFetching,
    refetchDashboard,
    streamState,
    updateOpsOrderMutate,
    isUpdateOpsOrderPending,
  } = useOpsOrders({
    status: filter,
    search: deferredSearch,
    autoRefresh,
  });

  const summaryCards = useMemo(
    () => [
      {
        key: "today",
        label: t("opsOrders.summary.todayOrders"),
        value: dashboardData?.summary.todayOrders ?? 0,
        icon: Activity,
      },
      {
        key: "pending",
        label: t("opsOrders.summary.pendingOrders"),
        value: dashboardData?.summary.pendingOrders ?? 0,
        icon: Clock3,
      },
      {
        key: "shipping",
        label: t("opsOrders.summary.shippingOrders"),
        value: dashboardData?.summary.shippingOrders ?? 0,
        icon: Truck,
      },
      {
        key: "claims",
        label: t("opsOrders.summary.claimOrders"),
        value: dashboardData?.summary.claimOrders ?? 0,
        icon: Siren,
      },
      {
        key: "urgent",
        label: t("opsOrders.summary.urgentOrders"),
        value: dashboardData?.summary.urgentOrdersCount ?? 0,
        icon: Radio,
      },
      {
        key: "overdue",
        label: t("opsOrders.summary.overdueOrders"),
        value: dashboardData?.summary.overdueOrdersCount ?? 0,
        icon: AlertTriangle,
      },
      {
        key: "unassigned",
        label: t("opsOrders.summary.unassignedOrders"),
        value: dashboardData?.summary.unassignedOrdersCount ?? 0,
        icon: ShieldCheck,
      },
    ],
    [dashboardData, t],
  );

  const queueCards = useMemo(
    () => [
      {
        key: "all" as QueuePreset,
        label: t("opsOrders.queue.all"),
        count: dashboardData?.summary.totalOrders ?? 0,
      },
      {
        key: "urgent" as QueuePreset,
        label: t("opsOrders.queue.urgent"),
        count: dashboardData?.summary.urgentOrdersCount ?? 0,
      },
      {
        key: "overdue" as QueuePreset,
        label: t("opsOrders.queue.overdue"),
        count: dashboardData?.summary.overdueOrdersCount ?? 0,
      },
      {
        key: "claims" as QueuePreset,
        label: t("opsOrders.queue.claims"),
        count: dashboardData?.summary.claimOrders ?? 0,
      },
      {
        key: "unassigned" as QueuePreset,
        label: t("opsOrders.queue.unassigned"),
        count: dashboardData?.summary.unassignedOrdersCount ?? 0,
      },
      {
        key: "mine" as QueuePreset,
        label: t("opsOrders.queue.mine"),
        count:
          (dashboardData?.orders ?? []).filter((order) =>
            matchesQueuePreset(order, "mine", currentOperator),
          ).length ?? 0,
      },
    ],
    [currentOperator, dashboardData, t],
  );

  const getShippingDraft = (
    orderId: number,
    carrier?: string | null,
    trackingNumber?: string | null,
  ) =>
    shippingDrafts[orderId] ?? {
      carrier: carrier ?? "",
      trackingNumber: trackingNumber ?? "",
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

  const getNoteDraft = (orderId: number) => noteDrafts[orderId] ?? { note: "" };

  const updateNoteDraft = (orderId: number, note: string) => {
    setNoteDrafts((prev) => ({
      ...prev,
      [orderId]: { note },
    }));
  };

  const getOpsMetaDraft = (
    orderId: number,
    meta: {
      assignedOperator?: string | null;
      priority: OrderPriority;
      slaDueAt?: string | null;
      internalMemo?: string | null;
    },
  ) =>
    opsMetaDrafts[orderId] ?? {
      assignedOperator: meta.assignedOperator ?? "",
      priority: meta.priority,
      slaDueAt: meta.slaDueAt ? String(meta.slaDueAt).slice(0, 16) : "",
      internalMemo: meta.internalMemo ?? "",
    };

  const updateOpsMetaDraft = (
    orderId: number,
    key: keyof OpsMetaDraft,
    value: string,
    base: OpsMetaDraft,
  ) => {
    setOpsMetaDrafts((prev) => ({
      ...prev,
      [orderId]: {
        ...base,
        [key]: value,
      },
    }));
  };

  const filteredOrders = useMemo(() => {
    const base = dashboardData?.orders ?? [];
    const queueFiltered = base.filter((order) => matchesQueuePreset(order, queuePreset, currentOperator));
    const priorityFiltered =
      priorityFilter === "all"
        ? queueFiltered
        : queueFiltered.filter((order) => order.priority === priorityFilter);
    const assigneeFiltered = deferredAssigneeFilter
      ? priorityFiltered.filter((order) =>
          (order.assignedOperator ?? "").toLowerCase().includes(deferredAssigneeFilter),
        )
      : priorityFiltered;

    return sortOrders(assigneeFiltered, sort);
  }, [currentOperator, dashboardData?.orders, deferredAssigneeFilter, priorityFilter, queuePreset, sort]);

  const focusOrders = useMemo(() => filteredOrders.slice(0, 3), [filteredOrders]);

  return (
    <div className="-mx-4 bg-white sm:-mx-6 lg:-mx-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#132238_52%,#1f4b6e_100%)] p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t("opsOrders.badge")}
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">{t("opsOrders.title")}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-200">{t("opsOrders.description")}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/ops/products/new">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                <Boxes className="h-4 w-4" />
                상품 등록
              </Button>
            </Link>
            <Badge
              className={[
                "border-white/20 px-2.5 py-1 text-[11px] text-white",
                streamState === "live"
                  ? "bg-emerald-500/20"
                  : streamState === "error"
                    ? "bg-red-500/20"
                    : "bg-white/10",
              ].join(" ")}
            >
              <Radio className="h-3 w-3" />
              {t(`opsOrders.stream.${streamState}`)}
            </Badge>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              onClick={() => setAutoRefresh((prev) => !prev)}
            >
              {autoRefresh ? t("opsOrders.autoRefreshOn") : t("opsOrders.autoRefreshOff")}
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              onClick={() => refetchDashboard()}
              disabled={isDashboardFetching}
            >
              <RefreshCcw className="h-4 w-4" />
              {t("opsOrders.refresh")}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-200">
          <span>
            {t("opsOrders.generatedAt", {
              date: dashboardData?.generatedAt ? formatDate(dashboardData.generatedAt, lang) : "-",
            })}
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1">
            {t("opsOrders.totalOrders", { count: dashboardData?.summary.totalOrders ?? 0 })}
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1">
            {t("opsOrders.delayedShipping", {
              count: dashboardData?.summary.delayedShippingOrders ?? 0,
            })}
          </span>
          {autoRefresh && (
            <span className="rounded-full bg-white/10 px-2.5 py-1">{t("opsOrders.streamHint")}</span>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.slice(0, 4).map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.key} className="gap-3 border-slate-200">
              <CardHeader className="pb-0">
                <CardDescription>{card.label}</CardDescription>
                <CardTitle className="flex items-center justify-between text-3xl font-semibold">
                  <span>{card.value}</span>
                  <Icon className="h-5 w-5 text-slate-500" />
                </CardTitle>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {summaryCards.slice(4).map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.key} className="gap-3 border-slate-200">
              <CardHeader className="pb-0">
                <CardDescription>{card.label}</CardDescription>
                <CardTitle className="flex items-center justify-between text-3xl font-semibold">
                  <span>{card.value}</span>
                  <Icon className="h-5 w-5 text-slate-500" />
                </CardTitle>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card className="gap-4 border-slate-200">
        <CardHeader className="pb-0">
          <CardTitle>{t("opsOrders.queueTitle")}</CardTitle>
          <CardDescription>{t("opsOrders.queueDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {queueCards.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setQueuePreset(item.key)}
              className={[
                "rounded-2xl border px-4 py-4 text-left transition-colors",
                queuePreset === item.key
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
              ].join(" ")}
            >
              <p className="text-sm font-medium">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.count}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="gap-4 border-slate-200">
        <CardHeader className="pb-0">
          <CardTitle>{t("opsOrders.controlsTitle")}</CardTitle>
          <CardDescription>{t("opsOrders.controlsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={searchInput}
            placeholder={t("opsOrders.searchPlaceholder")}
            onChange={(e) => startTransition(() => setSearchInput(e.target.value))}
          />

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Input
              value={assigneeFilter}
              placeholder={t("opsOrders.assigneeFilterPlaceholder")}
              onChange={(e) => setAssigneeFilter(e.target.value)}
            />

            <Select
              value={priorityFilter}
              onValueChange={(value) => setPriorityFilter(value as OrderPriority | "all")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("opsOrders.priorityFilterPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("opsOrders.priorityFilterAll")}</SelectItem>
                {PRIORITY_OPTIONS.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {t(`opsOrders.priority.${priority}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("opsOrders.sortTitle")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">{t("opsOrders.sort.latest")}</SelectItem>
                <SelectItem value="priority">{t("opsOrders.sort.priority")}</SelectItem>
                <SelectItem value="sla">{t("opsOrders.sort.sla")}</SelectItem>
              </SelectContent>
            </Select>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {t("opsOrders.filteredCount", { count: filteredOrders.length })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((status) => {
              const count =
                status === "all"
                  ? dashboardData?.summary.totalOrders ?? 0
                  : dashboardData?.statusCounts.find((item) => item.status === status)?.count ?? 0;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilter(status)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    filter === status
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {(status === "all" ? t("opsOrders.filters.all") : getOrderStatusLabel(status, t)) +
                    ` (${count})`}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="gap-4 border-slate-200">
        <CardHeader className="pb-0">
          <CardTitle>{t("opsOrders.focusTitle")}</CardTitle>
          <CardDescription>{t("opsOrders.focusDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 xl:grid-cols-3">
          {focusOrders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-sm text-slate-500">
              {t("opsOrders.focusEmpty")}
            </div>
          ) : (
            focusOrders.map((order) => {
              const slaState = getSlaStatus(order.slaDueAt);
              return (
                <Link key={order.id} href={`/ops/orders/${order.id}`}>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={ORDER_STATUS_BADGE_CLASS[order.status]}>
                        {getOrderStatusLabel(order.status, t)}
                      </Badge>
                      <Badge className={ORDER_PRIORITY_BADGE_CLASS[order.priority]}>
                        {t(`opsOrders.priority.${order.priority}`)}
                      </Badge>
                      <Badge className={ORDER_SLA_BADGE_CLASS[slaState]}>
                        {t(`opsOrders.slaState.${slaState}`)}
                      </Badge>
                    </div>
                    <p className="mt-3 font-semibold text-slate-900">#{order.id}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {order.user.name || t("opsOrders.unknownCustomer")}
                    </p>
                    <p className="mt-3 text-sm text-slate-500">
                      {t("opsOrders.assigneeLabel", { name: order.assignedOperator || "-" })}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredOrders.map((order) => {
          const title = getOrderItemTitle(order.orderItems, lang, t);
          const nextStatuses = getNextOrderStatuses(order.status);
          const shippingDraft = getShippingDraft(order.id, order.carrier, order.trackingNumber);
          const noteDraft = getNoteDraft(order.id);
          const opsMetaDraft = getOpsMetaDraft(order.id, {
            assignedOperator: order.assignedOperator,
            priority: order.priority,
            slaDueAt: order.slaDueAt,
            internalMemo: order.internalMemo,
          });
          const hasShippingInfo = Boolean(shippingDraft.carrier && shippingDraft.trackingNumber);
          const slaState = getSlaStatus(order.slaDueAt);

          return (
            <Card key={order.id} className="gap-0 overflow-hidden border-slate-200 p-0">
              <div className="border-b bg-slate-50/70 px-5 py-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                      <Badge className={ORDER_STATUS_BADGE_CLASS[order.status]}>
                        {getOrderStatusLabel(order.status, t)}
                      </Badge>
                      <Badge className={ORDER_PRIORITY_BADGE_CLASS[order.priority]}>
                        {t(`opsOrders.priority.${order.priority}`)}
                      </Badge>
                      <Badge className={ORDER_SLA_BADGE_CLASS[slaState]}>
                        {t(`opsOrders.slaState.${slaState}`)}
                      </Badge>
                      <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs text-slate-700">
                        #{order.id}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {order.user.name || t("opsOrders.unknownCustomer")} ·{" "}
                      {order.user.userId || order.user.email || order.user.id}
                    </p>
                    <p className="text-sm text-slate-500">
                      {t("opsOrders.customerContact", { phone: order.shipPhone })}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                      <span>{t("opsOrders.assigneeLabel", { name: order.assignedOperator || "-" })}</span>
                      <span>
                        {t("opsOrders.slaLabel", {
                          date: order.slaDueAt ? formatDate(order.slaDueAt, lang) : "-",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-1 text-sm text-slate-600 xl:text-right">
                    <p>{formatDate(order.createdAt, lang)}</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {t("price", { price: formatPrice(order.totalAmount, lang) })}
                    </p>
                    <p>{order.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 px-5 py-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,1fr)]">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                      <PackageSearch className="h-4 w-4 text-slate-500" />
                      <p className="text-sm font-medium text-slate-900">{t("opsOrders.actionsTitle")}</p>
                    </div>

                    {nextStatuses.length === 0 ? (
                      <p className="mt-3 text-sm text-slate-500">{t("opsOrders.noNext")}</p>
                    ) : (
                      <div className="mt-3 space-y-3">
                        <Textarea
                          className="min-h-24"
                          value={noteDraft.note}
                          placeholder={t("opsOrders.notePlaceholder")}
                          onChange={(e) => updateNoteDraft(order.id, e.target.value)}
                        />
                        <div className="flex flex-wrap gap-2">
                          {nextStatuses.map((status) => {
                            const requirement = getOrderTransitionRequirement(status);
                            const disabled =
                              isUpdateOpsOrderPending ||
                              (requirement.requiresShipping && !hasShippingInfo) ||
                              (requirement.requiresNote && !noteDraft.note.trim());

                            return (
                              <Button
                                key={status}
                                size="sm"
                                variant="outline"
                                disabled={disabled}
                                onClick={() =>
                                  updateOpsOrderMutate({
                                    id: order.id,
                                    nextStatus: status,
                                    note: noteDraft.note.trim() || null,
                                  })
                                }
                              >
                                {t("opsOrders.moveTo", {
                                  status: getOrderStatusLabel(status, t),
                                })}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-slate-500" />
                      <p className="text-sm font-medium text-slate-900">{t("opsOrders.shippingTitle")}</p>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <Input
                        value={shippingDraft.carrier}
                        placeholder={t("opsOrders.shippingCarrier")}
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
                        placeholder={t("opsOrders.shippingTracking")}
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
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdateOpsOrderPending}
                        onClick={() =>
                          updateOpsOrderMutate({
                            id: order.id,
                            carrier: shippingDraft.carrier || null,
                            trackingNumber: shippingDraft.trackingNumber || null,
                          })
                        }
                      >
                        {t("opsOrders.saveShipping")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdateOpsOrderPending}
                        onClick={() =>
                          setShippingDrafts((prev) => ({
                            ...prev,
                            [order.id]: {
                              carrier: "CJ대한통운",
                              trackingNumber: `OPS-${order.id}-LIVE`,
                            },
                          }))
                        }
                      >
                        {t("opsOrders.fillShipping")}
                      </Button>
                      <Link href={`/ops/orders/${order.id}`}>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4" />
                          {t("opsOrders.viewOperatorDetail")}
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-slate-500" />
                      <p className="text-sm font-medium text-slate-900">{t("opsOrders.opsMetaTitle")}</p>
                    </div>
                    <div className="mt-3 grid gap-3">
                      <div className="flex flex-wrap gap-2">
                        {currentOperator && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isUpdateOpsOrderPending}
                            onClick={() =>
                              updateOpsOrderMutate({
                                id: order.id,
                                assignedOperator: currentOperator,
                              })
                            }
                          >
                            {t("opsOrders.assignToMe")}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isUpdateOpsOrderPending}
                          onClick={() => {
                            const next = new Date(Date.now() + 1000 * 60 * 60 * 24);
                            const iso = next.toISOString().slice(0, 16);
                            setOpsMetaDrafts((prev) => ({
                              ...prev,
                              [order.id]: {
                                ...opsMetaDraft,
                                slaDueAt: iso,
                              },
                            }));
                          }}
                        >
                          {t("opsOrders.slaPlus1d")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isUpdateOpsOrderPending}
                          onClick={() => {
                            const next = new Date(Date.now() + 1000 * 60 * 60 * 48);
                            const iso = next.toISOString().slice(0, 16);
                            setOpsMetaDrafts((prev) => ({
                              ...prev,
                              [order.id]: {
                                ...opsMetaDraft,
                                slaDueAt: iso,
                              },
                            }));
                          }}
                        >
                          {t("opsOrders.slaPlus2d")}
                        </Button>
                      </div>
                      <Input
                        value={opsMetaDraft.assignedOperator}
                        placeholder={t("opsOrders.assignedOperator")}
                        onChange={(e) =>
                          updateOpsMetaDraft(order.id, "assignedOperator", e.target.value, opsMetaDraft)
                        }
                      />
                      <Select
                        value={opsMetaDraft.priority}
                        onValueChange={(value) =>
                          updateOpsMetaDraft(order.id, "priority", value, opsMetaDraft)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("opsOrders.priorityPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIORITY_OPTIONS.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {t(`opsOrders.priority.${priority}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="datetime-local"
                        value={opsMetaDraft.slaDueAt}
                        onChange={(e) =>
                          updateOpsMetaDraft(order.id, "slaDueAt", e.target.value, opsMetaDraft)
                        }
                      />
                      <Textarea
                        className="min-h-24"
                        value={opsMetaDraft.internalMemo}
                        placeholder={t("opsOrders.internalMemo")}
                        onChange={(e) =>
                          updateOpsMetaDraft(order.id, "internalMemo", e.target.value, opsMetaDraft)
                        }
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isUpdateOpsOrderPending}
                          onClick={() =>
                            updateOpsOrderMutate({
                              id: order.id,
                              assignedOperator: opsMetaDraft.assignedOperator || null,
                              priority: opsMetaDraft.priority,
                              slaDueAt: opsMetaDraft.slaDueAt || null,
                              internalMemo: opsMetaDraft.internalMemo || null,
                            })
                          }
                        >
                          {t("opsOrders.saveOpsMeta")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-900">{t("opsOrders.eventsTitle")}</p>
                    <span className="text-xs text-slate-500">
                      {order.orderEvents?.length ?? 0} {t("opsOrders.eventsCount")}
                    </span>
                  </div>

                  <div className="mt-3 space-y-3">
                    {(order.orderEvents ?? []).length === 0 ? (
                      <p className="text-sm text-slate-500">{t("opsOrders.eventsEmpty")}</p>
                    ) : (
                      order.orderEvents?.map((event, index) => (
                        <div key={event.id}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-900">{event.eventType}</p>
                              <p className="text-xs text-slate-500">{formatDate(event.createdAt, lang)}</p>
                              {event.note && (
                                <p className="mt-1 text-xs leading-5 text-slate-600">{event.note}</p>
                              )}
                            </div>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600">
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
            </Card>
          );
        })}

        {!isDashboardLoading && filteredOrders.length === 0 && (
          <Card className="border-dashed border-slate-300 p-10 text-center text-slate-500">
            {t("opsOrders.empty")}
          </Card>
        )}
      </div>
      </div>
    </div>
  );
}
