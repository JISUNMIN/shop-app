// app/order/_components/dialogs/CouponSelectDialog.tsx
"use client";

import { Gift } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Coupon } from "@/app/order/_components/types";
import type { OrderFormValues } from "@/app/order/_components/OrderShell";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupons: Coupon[];
  subtotal: number;
}

export function CouponSelectDialog({ open, onOpenChange, coupons, subtotal }: Props) {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<OrderFormValues>();
  const selectedCouponId = watch("selectedCouponId");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("order.couponDialog.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <div
            onClick={() => {
              setValue("selectedCouponId", null, { shouldDirty: true });
              onOpenChange(false);
            }}
            className={`p-4 rounded-lg border-2 cursor-pointer ${
              selectedCouponId === null ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <p className="font-semibold">{t("order.couponDialog.none")}</p>
          </div>

          {coupons.map((coupon) => {
            const canUse = subtotal >= coupon.minOrder;

            return (
              <div
                key={coupon.id}
                onClick={() => {
                  if (!canUse) return;
                  setValue("selectedCouponId", coupon.id, { shouldDirty: true });
                  onOpenChange(false);
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  !canUse
                    ? "opacity-50 cursor-not-allowed"
                    : selectedCouponId === coupon.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold">{coupon.name}</p>
                  <Gift className="w-5 h-5 text-orange-500" />
                </div>

                <p className="text-sm text-gray-600">
                  {coupon.minOrder > 0
                    ? t("order.couponDialog.minOrder", { amount: coupon.minOrder.toLocaleString() })
                    : t("order.couponDialog.noLimit")}
                </p>

                {!canUse && (
                  <p className="text-xs text-red-500 mt-1">
                    {t("order.couponDialog.notEnough", {
                      remain: (coupon.minOrder - subtotal).toLocaleString(),
                    })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
