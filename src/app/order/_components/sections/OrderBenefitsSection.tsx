// app/order/_components/sections/OrderBenefitsSection.tsx
import { Gift } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import type { Coupon } from "@/types";
import type { OrderFormValues } from "@/app/order/_components/OrderShell";

interface Props {
  selectedCoupon: Coupon | undefined;
  couponDiscount: number;
  availablePoints: number;
  pointsMax: number;
  onOpenCouponDialog: () => void;
}

export function OrderBenefitsSection({
  selectedCoupon,
  couponDiscount,
  availablePoints,
  pointsMax,
  onOpenCouponDialog,
}: Props) {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<OrderFormValues>();

  const usePoints = watch("usePoints");
  const pointsToUse = watch("pointsToUse");

  return (
    <Card className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold mb-4">{t("order.benefits.title")}</h2>

      <div className="space-y-4">
        <div>
          <Label>{t("order.coupon.label")}</Label>
          <Button
            variant="outline"
            className="w-full mt-2 justify-between"
            onClick={onOpenCouponDialog}
          >
            <span className="inline-flex items-center gap-2">
              <Gift className="w-4 h-4 text-orange-500" />
              {selectedCoupon
                ? t("order.coupon.selected", {
                    name: selectedCoupon.name,
                    discount: couponDiscount.toLocaleString(),
                  })
                : t("order.coupon.select")}
            </span>
            <span className="text-gray-500">{t("order.common.select")}</span>
          </Button>
        </div>

        {/* <div>
          <div className="flex items-center justify-between mb-2">
            <Label>{t("order.points.label")}</Label>
            <p className="text-sm text-gray-600">
              {t("order.points.available", { points: availablePoints.toLocaleString() })}
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={t("order.points.placeholder")}
              value={pointsToUse || ""}
              onChange={(e) => {
                const raw = parseInt(e.target.value) || 0;
                setValue("usePoints", true, { shouldDirty: true });
                setValue("pointsToUse", Math.min(raw, pointsMax), { shouldDirty: true });
              }}
              disabled={!usePoints}
              className="flex-1"
            />

            <Button
              variant="outline"
              onClick={() => {
                if (usePoints) {
                  setValue("usePoints", false, { shouldDirty: true });
                  setValue("pointsToUse", 0, { shouldDirty: true });
                } else {
                  setValue("usePoints", true, { shouldDirty: true });
                }
              }}
            >
              {usePoints ? t("order.common.cancel") : t("order.common.use")}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setValue("usePoints", true, { shouldDirty: true });
                setValue("pointsToUse", pointsMax, { shouldDirty: true });
              }}
            >
              {t("order.points.useAll")}
            </Button>
          </div>

          {usePoints && (
            <p className="mt-2 text-xs text-gray-500">
              {t("order.points.max", { max: pointsMax.toLocaleString() })}
            </p>
          )}
        </div> */}
      </div>
    </Card>
  );
}
