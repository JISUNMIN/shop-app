// utils/orders.ts
import type { TFunction } from "i18next";

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
    case "PAID":
    case "CONFIRMED":
    case "SHIPPING":
      return t("mypage.orderDetail.shippingStatus.preparing");
    case "SHIPPED":
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
    case "PAID":
    case "PENDING":
      return 0; // ordered
    case "CONFIRMED":
    case "SHIPPING":
      return 1; // preparing
    case "SHIPPED":
      return 2; // shipping
    case "DELIVERED":
      return 3; // delivered
    default:
      return 0;
  }
};

export const ORDER_STATUS_BADGE_CLASS: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  SHIPPING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-gray-200 text-gray-700",

  CANCEL_REQUESTED: "bg-orange-100 text-orange-700",
  REFUNDED: "bg-red-100 text-red-700",

  RETURN_REQUESTED: "bg-purple-100 text-purple-700",
  RETURNED: "bg-zinc-200 text-zinc-800",
};

export const ORDER_STATUS_LABEL_KEY_MAP: Record<string, string> = {
  PAID: "order.status.paid",
  SHIPPING: "order.status.shipping",
  SHIPPED: "order.status.shipped",
  DELIVERED: "order.status.delivered",
  CANCEL_REQUESTED: "order.status.cancelRequested",
  CANCELLED: "order.status.cancelled",
  REFUNDED: "order.status.refunded",
  RETURN_REQUESTED: "order.status.returnRequested",
  RETURNED: "order.status.returned",
  PENDING: "order.status.pending",
  CONFIRMED: "order.status.confirmed",
};

// 필터별 상태 그룹
export const ORDER_FILTER_STATUS: Record<string, string[]> = {
  all: [],
  active: ["PAID", "SHIPPING", "SHIPPED", "CONFIRMED"],
  delivered: ["DELIVERED"],
  claims: ["CANCEL_REQUESTED", "CANCELLED", "REFUNDED", "RETURN_REQUESTED", "RETURNED"],
};

export const getOrderStatusLabel = (status: string, t: TFunction) => {
  const key = ORDER_STATUS_LABEL_KEY_MAP[status];
  return key ? t(key) : status;
};

export const filterOrdersByStatus = (orders: any[], filter: string) => {
  const statuses = ORDER_FILTER_STATUS[filter] ?? [];
  if (filter === "all" || statuses.length === 0) return orders;
  return orders.filter((o) => statuses.includes(o.status));
};

export const getOrderItemTitle = (
  orderedItems: any[],
  lang: string,
  t: TFunction,
  emptyText = "-",
) => {
  if (!orderedItems || orderedItems.length === 0) return emptyText;

  const firstItem = orderedItems[0];
  const productName = firstItem.product?.name?.[lang] ?? emptyText;

  const extraCount = orderedItems.length - 1;
  return extraCount > 0
    ? t("mypage.orders.itemSummary", { name: productName, count: extraCount })
    : productName;
};

export const ORDER_DELIVERY_MEMOS = [
  "직접 입력",
  "문 앞에 놓아주세요",
  "경비실에 맡겨주세요",
  "택배함에 넣어주세요",
  "배송 전 연락주세요",
  "부재 시 연락주세요",
] as const;
