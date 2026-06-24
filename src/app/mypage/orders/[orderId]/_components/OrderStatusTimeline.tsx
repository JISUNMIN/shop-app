"use client";

import { useTranslation } from "react-i18next";
import type { LangCode, Order } from "@/types";
import {
  getAvailableOrderActions,
  getOrderFlowStepState,
  getOrderStatusLabel,
  getOrderTimelineEntries,
  ORDER_MAIN_FLOW,
} from "@/utils/orders";

const STEP_STYLE = {
  done: "border-emerald-200 bg-emerald-50 text-emerald-700",
  current: "border-blue-200 bg-blue-50 text-blue-700",
  upcoming: "border-gray-200 bg-gray-50 text-gray-500",
} as const;

const EVENT_TONE_STYLE = {
  neutral: "bg-gray-200",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
} as const;

export default function OrderStatusTimeline({
  order,
  lang,
}: {
  order: Order;
  lang: LangCode;
}) {
  const { t } = useTranslation();
  const actions = getAvailableOrderActions(order.status);
  const timelineEntries = getOrderTimelineEntries(order, lang, t);

  return (
    <section className="mb-6 sm:mb-8 rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-semibold">{t("mypage.orderDetail.timeline.title")}</h2>
          <p className="text-sm text-gray-600">
            {t("mypage.orderDetail.timeline.currentStatus", {
              status: getOrderStatusLabel(order.status, t),
            })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {actions.length === 0 ? (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {t("mypage.orderDetail.timeline.noAction")}
            </span>
          ) : (
            actions.map((action) => (
              <span
                key={action}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {action === "cancel"
                  ? t("mypage.orderDetail.timeline.availableCancel")
                  : t("mypage.orderDetail.timeline.availableReturn")}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {ORDER_MAIN_FLOW.map((status) => {
          const stepState = getOrderFlowStepState(order.status, status);

          return (
            <div
              key={status}
              className={`rounded-xl border px-4 py-3 ${STEP_STYLE[stepState]}`}
            >
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

      <div className="mt-5 space-y-3">
        {timelineEntries.map((entry) => (
          <div key={entry.key} className="flex items-start gap-3">
            <div className={`mt-1.5 h-2.5 w-2.5 rounded-full ${EVENT_TONE_STYLE[entry.tone]}`} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900">{entry.label}</p>
              <p className="text-xs text-gray-500">
                {entry.date ?? t("mypage.orderDetail.timeline.awaitingUpdate")}
              </p>
              {entry.note && <p className="mt-1 text-xs text-gray-500">{entry.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
