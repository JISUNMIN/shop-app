"use client";

import { ExternalLink, PackageSearch, Copy, Truck } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { Order } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  getTrackingSearchUrl,
  getTrackingStatusInsight,
} from "@/utils/shippingTracking";
import { getOrderStatusLabel, getShippingStatusLabel } from "@/utils/orders";

type OrderTrackingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
};

const INSIGHT_TONE_CLASS_MAP: Record<string, string> = {
  slate: "border-slate-200 bg-slate-50 text-slate-700",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
};

export default function OrderTrackingDialog({
  open,
  onOpenChange,
  order,
}: OrderTrackingDialogProps) {
  const { t } = useTranslation();
  const trackingUrl = getTrackingSearchUrl(order.carrier, order.trackingNumber);
  const insight = getTrackingStatusInsight(order.status, t);
  const shippingStatusLabel = getShippingStatusLabel(order.status, t);
  const orderStatusLabel = getOrderStatusLabel(order.status, t);

  const handleCopyTrackingNumber = async () => {
    if (!order.trackingNumber) return;

    try {
      await navigator.clipboard.writeText(order.trackingNumber);
      toast.success(t("mypage.orderDetail.trackingDialog.toastCopied"));
    } catch {
      toast.error(t("mypage.orderDetail.trackingDialog.toastCopyFailed"));
    }
  };

  const handleOpenTracking = () => {
    if (!trackingUrl) return;
    window.open(trackingUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>{t("mypage.orderDetail.trackingDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("mypage.orderDetail.trackingDialog.description", { id: order.id })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="rounded-3xl bg-slate-950 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                    {t("mypage.orderDetail.trackingDialog.currentShipping")}
                  </p>
                  <p className="mt-1 text-lg font-semibold">{shippingStatusLabel}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/6 p-3">
                  <p className="text-xs text-slate-300">
                    {t("mypage.orderDetail.trackingDialog.orderStatus")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">{orderStatusLabel}</p>
                </div>

                <div className="rounded-2xl bg-white/6 p-3">
                  <p className="text-xs text-slate-300">
                    {t("mypage.orderDetail.trackingDialog.carrier")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white break-words">
                    {order.carrier ?? "-"}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/6 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                  {t("mypage.orderDetail.trackingDialog.trackingNumber")}
                </p>
                <p className="mt-2 text-base font-semibold text-white break-all">
                  {order.trackingNumber ?? "-"}
                </p>
              </div>
            </div>

            <div
              className={[
                "rounded-3xl border p-5",
                INSIGHT_TONE_CLASS_MAP[insight.tone] ?? INSIGHT_TONE_CLASS_MAP.slate,
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70">
                  <PackageSearch className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] opacity-80">
                    {t("mypage.orderDetail.trackingDialog.insightTitle")}
                  </p>
                  <p className="mt-1 text-base font-semibold">{insight.label}</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 opacity-90">{insight.description}</p>

              <div className="mt-4 rounded-2xl bg-white/70 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">
                  {t("mypage.orderDetail.trackingDialog.helperTitle")}
                </p>
                <p className="mt-2 leading-6">
                  {t("mypage.orderDetail.trackingDialog.helperDescription")}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t("mypage.orderDetail.trackingDialog.actionGuide1Title")}
              </p>
              <p className="mt-2 text-sm text-slate-700">
                {t("mypage.orderDetail.trackingDialog.actionGuide1Description")}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t("mypage.orderDetail.trackingDialog.actionGuide2Title")}
              </p>
              <p className="mt-2 text-sm text-slate-700">
                {t("mypage.orderDetail.trackingDialog.actionGuide2Description")}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t("mypage.orderDetail.trackingDialog.actionGuide3Title")}
              </p>
              <p className="mt-2 text-sm text-slate-700">
                {t("mypage.orderDetail.trackingDialog.actionGuide3Description")}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button type="button" variant="outline" onClick={handleCopyTrackingNumber}>
            <Copy className="mr-2 h-4 w-4" />
            {t("mypage.orderDetail.trackingDialog.copy")}
          </Button>

          <Button type="button" onClick={handleOpenTracking} disabled={!trackingUrl}>
            <ExternalLink className="mr-2 h-4 w-4" />
            {t("mypage.orderDetail.trackingDialog.openExternal")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
