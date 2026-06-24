// utils/orders.ts
import type { TFunction } from "i18next";
import type {
  LocalizedText,
  Order,
  OrderActionType,
  OrderEvent,
  OrderEventType,
  OrderStatus,
} from "@/types";
import { formatDate } from "@/utils/helper";

export const SHIP_MEMO_KEY_LIST = [
  "frontDoor",
  "guardOffice",
  "parcelBox",
  "callBefore",
  "callIfAbsent",
] as const;

export type ShipMemoKey = (typeof SHIP_MEMO_KEY_LIST)[number];

export const getShipMemoText = (shipMemo: string | null | undefined, t: TFunction) => {
  if (!shipMemo) return "-";
  const isPreset = (SHIP_MEMO_KEY_LIST as readonly string[]).includes(shipMemo);
  return isPreset ? t(`order.deliveryMemo.options.${shipMemo}`) : shipMemo;
};

export const getShippingStatusLabel = (status: string, t: TFunction) => {
  switch (status) {
    case "PENDING":
    case "PAID":
      return t("mypage.orderDetail.shippingStatus.preparing");
    case "SHIPPING":
      return t("mypage.orderDetail.shippingStatus.shipping");
    case "DELIVERED":
      return t("mypage.orderDetail.shippingStatus.delivered");

    case "CANCEL_REQUESTED":
      return t("mypage.orderDetail.shippingStatus.cancelRequested");
    case "REFUNDED":
      return t("mypage.orderDetail.shippingStatus.refunded");
    case "RETURN_REQUESTED":
      return t("mypage.orderDetail.shippingStatus.returnRequested");
    case "RETURNED":
      return t("mypage.orderDetail.shippingStatus.returned");

    default:
      return t("mypage.orderDetail.shippingStatus.inProgress");
  }
};

export const getDeliveryProgressStep = (status: string) => {
  switch (status) {
    case "PENDING":
      return 0;
    case "PAID":
      return 2;
    case "SHIPPING":
      return 3;
    case "DELIVERED":
      return 4;
    default:
      return 0;
  }
};

export const ORDER_STATUS_BADGE_CLASS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PAID: "bg-green-100 text-green-700",
  SHIPPING: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-gray-200 text-gray-700",

  CANCEL_REQUESTED: "bg-orange-100 text-orange-700",
  REFUNDED: "bg-red-100 text-red-700",

  RETURN_REQUESTED: "bg-purple-100 text-purple-700",
  RETURNED: "bg-zinc-200 text-zinc-800",
};

export const ORDER_STATUS_LABEL_KEY_MAP: Record<string, string> = {
  PENDING: "order.status.pending",
  PAID: "order.status.paid",
  SHIPPING: "order.status.shipping",
  DELIVERED: "order.status.delivered",
  CANCEL_REQUESTED: "order.status.cancelRequested",
  REFUNDED: "order.status.refunded",
  RETURN_REQUESTED: "order.status.returnRequested",
  RETURNED: "order.status.returned",
};

export const ORDER_MAIN_FLOW: OrderStatus[] = [
  "PENDING" as OrderStatus,
  "PAID" as OrderStatus,
  "SHIPPING" as OrderStatus,
  "DELIVERED" as OrderStatus,
];

export const ORDER_ACTIONABLE_STATUS: Record<OrderActionType, OrderStatus[]> = {
  cancel: ["PENDING" as OrderStatus, "PAID" as OrderStatus],
  return: ["DELIVERED" as OrderStatus],
};

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID" as OrderStatus, "CANCEL_REQUESTED" as OrderStatus],
  PAID: ["SHIPPING" as OrderStatus, "CANCEL_REQUESTED" as OrderStatus],
  SHIPPING: ["DELIVERED" as OrderStatus],
  DELIVERED: ["RETURN_REQUESTED" as OrderStatus],
  CANCEL_REQUESTED: ["REFUNDED" as OrderStatus],
  REFUNDED: [],
  RETURN_REQUESTED: ["RETURNED" as OrderStatus],
  RETURNED: [],
};

// 필터별 상태 그룹
export const ORDER_FILTER_STATUS: Record<string, string[]> = {
  all: [],
  active: ["PENDING", "PAID", "SHIPPING"],
  delivered: ["DELIVERED"],
  claims: ["CANCEL_REQUESTED", "REFUNDED", "RETURN_REQUESTED", "RETURNED"],
};

export const getOrderStatusLabel = (status: string, t: TFunction) => {
  const key = ORDER_STATUS_LABEL_KEY_MAP[status];
  return key ? t(key) : status;
};

export const getAvailableOrderActions = (status: OrderStatus): OrderActionType[] => {
  return (Object.keys(ORDER_ACTIONABLE_STATUS) as OrderActionType[]).filter((action) =>
    ORDER_ACTIONABLE_STATUS[action].includes(status),
  );
};

export const getNextOrderStatuses = (status: OrderStatus) => {
  return ORDER_STATUS_TRANSITIONS[status] ?? [];
};

export const isValidOrderStatusTransition = (from: OrderStatus, to: OrderStatus) => {
  return getNextOrderStatuses(from).includes(to);
};

export type OrderTransitionRequirement = {
  requiresShipping: boolean;
  requiresNote: boolean;
};

export const getOrderTransitionRequirement = (
  nextStatus: OrderStatus,
): OrderTransitionRequirement => {
  switch (nextStatus) {
    case "SHIPPING":
    case "DELIVERED":
      return {
        requiresShipping: true,
        requiresNote: false,
      };
    case "REFUNDED":
    case "RETURNED":
      return {
        requiresShipping: false,
        requiresNote: true,
      };
    default:
      return {
        requiresShipping: false,
        requiresNote: false,
      };
  }
};

export const getOrderFlowStepState = (currentStatus: OrderStatus, targetStatus: OrderStatus) => {
  const currentIndex = ORDER_MAIN_FLOW.indexOf(currentStatus);
  const targetIndex = ORDER_MAIN_FLOW.indexOf(targetStatus);

  if (targetIndex === -1) return "upcoming" as const;
  if (currentIndex === -1) return "upcoming" as const;
  if (targetIndex < currentIndex) return "done" as const;
  if (targetIndex === currentIndex) return "current" as const;
  return "upcoming" as const;
};

type OrderStatusLike = {
  status: string;
};

type OrderItemTitleLike = {
  product?: {
    name?: Partial<LocalizedText> | null;
  } | null;
};

export const filterOrdersByStatus = <T extends OrderStatusLike>(orders: T[], filter: string) => {
  const statuses = ORDER_FILTER_STATUS[filter] ?? [];
  if (filter === "all" || statuses.length === 0) return orders;
  return orders.filter((o) => statuses.includes(o.status));
};

export const getOrderItemTitle = (
  orderedItems: OrderItemTitleLike[],
  lang: string,
  t: TFunction,
  emptyText = "-",
) => {
  if (!orderedItems || orderedItems.length === 0) return emptyText;

  const firstItem = orderedItems[0];
  const productName = firstItem.product?.name?.[lang as keyof LocalizedText] ?? emptyText;

  const extraCount = orderedItems.length - 1;
  return extraCount > 0
    ? t("mypage.orders.itemSummary", { name: productName, count: extraCount })
    : productName;
};

export type OrderTimelineEntry = {
  key: string;
  label: string;
  date: string | null;
  tone: "neutral" | "success" | "warning";
  note?: string | null;
};

export type OrderInsightTone = "slate" | "amber" | "blue" | "emerald" | "rose" | "violet";

export type OrderInsightSummary = {
  tone: OrderInsightTone;
  label: string;
  description: string;
};

function getTimelineLabelByEventType(eventType: OrderEventType, t: TFunction) {
  switch (eventType) {
    case "ORDER_CREATED":
      return t("mypage.orderDetail.timeline.events.created");
    case "PAYMENT_CONFIRMED":
      return t("mypage.orderDetail.timeline.events.paid");
    case "SHIPPING_STARTED":
      return t("mypage.orderDetail.timeline.events.shippingStarted");
    case "DELIVERED":
      return t("mypage.orderDetail.timeline.events.delivered");
    case "CANCEL_REQUESTED":
      return t("mypage.orderDetail.timeline.events.cancelRequested");
    case "REFUNDED":
      return t("mypage.orderDetail.timeline.events.refunded");
    case "RETURN_REQUESTED":
      return t("mypage.orderDetail.timeline.events.returnRequested");
    case "RETURNED":
      return t("mypage.orderDetail.timeline.events.returned");
    case "STATUS_CHANGED":
    default:
      return t("mypage.orderDetail.timeline.events.updated");
  }
}

function getTimelineToneByEventType(eventType: OrderEventType): OrderTimelineEntry["tone"] {
  switch (eventType) {
    case "CANCEL_REQUESTED":
    case "RETURN_REQUESTED":
      return "warning";
    case "PAYMENT_CONFIRMED":
    case "DELIVERED":
    case "REFUNDED":
    case "RETURNED":
      return "success";
    default:
      return "neutral";
  }
}

function mapOrderEventsToTimelineEntries(
  orderEvents: OrderEvent[],
  lang: string,
  t: TFunction,
): OrderTimelineEntry[] {
  return orderEvents.map((event) => ({
    key: `event-${event.id}`,
    label: getTimelineLabelByEventType(event.eventType, t),
    date: formatDate(event.createdAt, lang as "ko" | "en"),
    tone: getTimelineToneByEventType(event.eventType),
    note: event.note ?? null,
  }));
}

export const getOrderTimelineEntries = (
  order: Pick<
    Order,
    | "createdAt"
    | "paidAt"
    | "deliveredAt"
    | "refundedAt"
    | "returnedAt"
    | "cancelRequestedAt"
    | "returnRequestedAt"
    | "status"
    | "orderEvents"
  >,
  lang: string,
  t: TFunction,
) => {
  if (order.orderEvents && order.orderEvents.length > 0) {
    return mapOrderEventsToTimelineEntries(order.orderEvents, lang, t);
  }

  const entries: OrderTimelineEntry[] = [
    {
      key: "created",
      label: t("mypage.orderDetail.timeline.events.created"),
      date: order.createdAt ? formatDate(order.createdAt, lang as "ko" | "en") : null,
      tone: "neutral",
    },
  ];

  if (order.paidAt) {
    entries.push({
      key: "paid",
      label: t("mypage.orderDetail.timeline.events.paid"),
      date: formatDate(order.paidAt, lang as "ko" | "en"),
      tone: "success",
    });
  } else if (order.status === "PENDING") {
    entries.push({
      key: "pending-payment",
      label: t("mypage.orderDetail.timeline.events.pendingPayment"),
      date: null,
      tone: "warning",
    });
  }

  if (order.cancelRequestedAt) {
    entries.push({
      key: "cancel-requested",
      label: t("mypage.orderDetail.timeline.events.cancelRequested"),
      date: formatDate(order.cancelRequestedAt, lang as "ko" | "en"),
      tone: "warning",
    });
  }

  if (order.refundedAt || order.status === "REFUNDED") {
    entries.push({
      key: "refunded",
      label: t("mypage.orderDetail.timeline.events.refunded"),
      date: order.refundedAt ? formatDate(order.refundedAt, lang as "ko" | "en") : null,
      tone: "success",
    });
  }

  if (order.deliveredAt || order.status === "DELIVERED") {
    entries.push({
      key: "delivered",
      label: t("mypage.orderDetail.timeline.events.delivered"),
      date: order.deliveredAt ? formatDate(order.deliveredAt, lang as "ko" | "en") : null,
      tone: "success",
    });
  }

  if (order.returnRequestedAt) {
    entries.push({
      key: "return-requested",
      label: t("mypage.orderDetail.timeline.events.returnRequested"),
      date: formatDate(order.returnRequestedAt, lang as "ko" | "en"),
      tone: "warning",
    });
  }

  if (order.returnedAt || order.status === "RETURNED") {
    entries.push({
      key: "returned",
      label: t("mypage.orderDetail.timeline.events.returned"),
      date: order.returnedAt ? formatDate(order.returnedAt, lang as "ko" | "en") : null,
      tone: "success",
    });
  }

  return entries;
};

export const getOrderProgressPercent = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return 12;
    case "PAID":
      return 38;
    case "SHIPPING":
      return 72;
    case "DELIVERED":
      return 100;
    case "CANCEL_REQUESTED":
      return 24;
    case "REFUNDED":
      return 100;
    case "RETURN_REQUESTED":
      return 84;
    case "RETURNED":
      return 100;
    default:
      return 0;
  }
};

export const getOrderAttentionSummary = (
  order: Pick<Order, "status" | "trackingNumber" | "carrier" | "paymentMethod">,
  t: TFunction,
): OrderInsightSummary => {
  switch (order.status) {
    case "PENDING":
      return {
        tone: "amber",
        label: t("mypage.orders.summary.attention.pendingPaymentLabel"),
        description: t("mypage.orders.summary.attention.pendingPaymentDescription"),
      };
    case "PAID":
      return {
        tone: "blue",
        label: t("mypage.orders.summary.attention.preparingLabel"),
        description: t("mypage.orders.summary.attention.preparingDescription"),
      };
    case "SHIPPING":
      return order.trackingNumber && order.carrier
        ? {
            tone: "blue",
            label: t("mypage.orders.summary.attention.shippingActiveLabel"),
            description: t("mypage.orders.summary.attention.shippingActiveDescription"),
          }
        : {
            tone: "amber",
            label: t("mypage.orders.summary.attention.shippingPendingLabel"),
            description: t("mypage.orders.summary.attention.shippingPendingDescription"),
          };
    case "DELIVERED":
      return {
        tone: "emerald",
        label: t("mypage.orders.summary.attention.deliveredLabel"),
        description: t("mypage.orders.summary.attention.deliveredDescription"),
      };
    case "CANCEL_REQUESTED":
      return {
        tone: "rose",
        label: t("mypage.orders.summary.attention.cancelRequestedLabel"),
        description: t("mypage.orders.summary.attention.cancelRequestedDescription"),
      };
    case "REFUNDED":
      return {
        tone: "slate",
        label: t("mypage.orders.summary.attention.refundedLabel"),
        description: t("mypage.orders.summary.attention.refundedDescription"),
      };
    case "RETURN_REQUESTED":
      return {
        tone: "violet",
        label: t("mypage.orders.summary.attention.returnRequestedLabel"),
        description: t("mypage.orders.summary.attention.returnRequestedDescription"),
      };
    case "RETURNED":
      return {
        tone: "slate",
        label: t("mypage.orders.summary.attention.returnedLabel"),
        description: t("mypage.orders.summary.attention.returnedDescription"),
      };
    default:
      return {
        tone: "slate",
        label: t("mypage.orders.summary.attention.defaultLabel"),
        description: t("mypage.orders.summary.attention.defaultDescription"),
      };
  }
};

export const getOrderCustomerActionSummary = (
  order: Pick<Order, "status" | "trackingNumber">,
  t: TFunction,
): OrderInsightSummary => {
  const availableActions = getAvailableOrderActions(order.status);

  if (availableActions.includes("cancel")) {
    return {
      tone: "amber",
      label: t("mypage.orderDetail.insights.customerAction.cancelLabel"),
      description: t("mypage.orderDetail.insights.customerAction.cancelDescription"),
    };
  }

  if (availableActions.includes("return")) {
    return {
      tone: "violet",
      label: t("mypage.orderDetail.insights.customerAction.returnLabel"),
      description: t("mypage.orderDetail.insights.customerAction.returnDescription"),
    };
  }

  if (order.status === "SHIPPING" && order.trackingNumber) {
    return {
      tone: "blue",
      label: t("mypage.orderDetail.insights.customerAction.trackLabel"),
      description: t("mypage.orderDetail.insights.customerAction.trackDescription"),
    };
  }

  if (order.status === "DELIVERED") {
    return {
      tone: "emerald",
      label: t("mypage.orderDetail.insights.customerAction.completeLabel"),
      description: t("mypage.orderDetail.insights.customerAction.completeDescription"),
    };
  }

  if (order.status === "REFUNDED" || order.status === "RETURNED") {
    return {
      tone: "slate",
      label: t("mypage.orderDetail.insights.customerAction.doneLabel"),
      description: t("mypage.orderDetail.insights.customerAction.doneDescription"),
    };
  }

  return {
    tone: "slate",
    label: t("mypage.orderDetail.insights.customerAction.waitLabel"),
    description: t("mypage.orderDetail.insights.customerAction.waitDescription"),
  };
};

export const ORDER_DELIVERY_MEMOS = [
  "직접 입력",
  "문 앞에 놓아주세요",
  "경비실에 맡겨주세요",
  "택배함에 넣어주세요",
  "배송 전 연락주세요",
  "부재 시 연락주세요",
] as const;
