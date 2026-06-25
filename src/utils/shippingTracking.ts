import type { TFunction } from "i18next";
import type { OrderStatus } from "@/types";

const CARRIER_QUERY_KEYWORD_MAP: Record<string, string> = {
  "CJ대한통운": "CJ대한통운 택배조회",
  "cj logistics": "CJ Logistics tracking",
  "한진택배": "한진택배 배송조회",
  "롯데택배": "롯데택배 배송조회",
  "로젠택배": "로젠택배 배송조회",
  "우체국택배": "우체국택배 배송조회",
};

export type TrackingInsight = {
  tone: "slate" | "amber" | "blue" | "emerald" | "rose" | "violet";
  label: string;
  description: string;
};

export const getTrackingSearchUrl = (carrier?: string | null, trackingNumber?: string | null) => {
  if (!trackingNumber) return null;

  const trimmedCarrier = carrier?.trim() ?? "";
  const keyword =
    CARRIER_QUERY_KEYWORD_MAP[trimmedCarrier] ??
    (trimmedCarrier ? `${trimmedCarrier} 배송조회` : "택배 배송조회");

  const query = `${keyword} ${trackingNumber}`.trim();
  return `https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`;
};

export const getTrackingStatusInsight = (status: OrderStatus, t: TFunction): TrackingInsight => {
  switch (status) {
    case "PENDING":
      return {
        tone: "amber",
        label: t("mypage.orderDetail.trackingDialog.insight.pendingLabel"),
        description: t("mypage.orderDetail.trackingDialog.insight.pendingDescription"),
      };
    case "PAID":
      return {
        tone: "blue",
        label: t("mypage.orderDetail.trackingDialog.insight.preparingLabel"),
        description: t("mypage.orderDetail.trackingDialog.insight.preparingDescription"),
      };
    case "SHIPPING":
      return {
        tone: "blue",
        label: t("mypage.orderDetail.trackingDialog.insight.shippingLabel"),
        description: t("mypage.orderDetail.trackingDialog.insight.shippingDescription"),
      };
    case "DELIVERED":
      return {
        tone: "emerald",
        label: t("mypage.orderDetail.trackingDialog.insight.deliveredLabel"),
        description: t("mypage.orderDetail.trackingDialog.insight.deliveredDescription"),
      };
    case "CANCEL_REQUESTED":
      return {
        tone: "rose",
        label: t("mypage.orderDetail.trackingDialog.insight.cancelRequestedLabel"),
        description: t("mypage.orderDetail.trackingDialog.insight.cancelRequestedDescription"),
      };
    case "REFUNDED":
      return {
        tone: "slate",
        label: t("mypage.orderDetail.trackingDialog.insight.refundedLabel"),
        description: t("mypage.orderDetail.trackingDialog.insight.refundedDescription"),
      };
    case "RETURN_REQUESTED":
      return {
        tone: "violet",
        label: t("mypage.orderDetail.trackingDialog.insight.returnRequestedLabel"),
        description: t("mypage.orderDetail.trackingDialog.insight.returnRequestedDescription"),
      };
    case "RETURNED":
      return {
        tone: "slate",
        label: t("mypage.orderDetail.trackingDialog.insight.returnedLabel"),
        description: t("mypage.orderDetail.trackingDialog.insight.returnedDescription"),
      };
    default:
      return {
        tone: "slate",
        label: t("mypage.orderDetail.trackingDialog.insight.defaultLabel"),
        description: t("mypage.orderDetail.trackingDialog.insight.defaultDescription"),
      };
  }
};
