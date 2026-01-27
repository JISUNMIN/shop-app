// app/order/_components/sections/OrderAgreementsSection.tsx
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useFormContext } from "react-hook-form";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import type { OrderFormValues } from "@/app/order/_components/OrderShell";

export function OrderAgreementsSection() {
  const { t } = useTranslation();
  const { control, watch, setValue } = useFormContext<OrderFormValues>();

  const agreements = watch("agreements");

  const agreementAll = useMemo(
    () => !!agreements.terms && !!agreements.privacy && !!agreements.payment,
    [agreements]
  );

  const setAll = (checked: boolean) => {
    setValue("agreements.terms", checked, { shouldDirty: true });
    setValue("agreements.privacy", checked, { shouldDirty: true });
    setValue("agreements.payment", checked, { shouldDirty: true });
  };

  return (
    <Card className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold mb-4">{t("order.agreements.title")}</h2>

      <div className="space-y-3">
        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <Checkbox checked={agreementAll} onCheckedChange={(v) => setAll(!!v)} id="agreement-all" />
          <Label htmlFor="agreement-all" className="ml-3 font-semibold cursor-pointer">
            {t("order.agreements.all")}
          </Label>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Controller
              control={control}
              name="agreements.terms"
              render={({ field }) => (
                <Checkbox checked={!!field.value} onCheckedChange={(v) => field.onChange(!!v)} id="terms" />
              )}
            />
            <Label htmlFor="terms" className="ml-3 cursor-pointer">
              {t("order.agreements.terms")}
            </Label>
          </div>
          <Button variant="ghost" size="sm">
            {t("order.common.view")}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Controller
              control={control}
              name="agreements.privacy"
              render={({ field }) => (
                <Checkbox checked={!!field.value} onCheckedChange={(v) => field.onChange(!!v)} id="privacy" />
              )}
            />
            <Label htmlFor="privacy" className="ml-3 cursor-pointer">
              {t("order.agreements.privacy")}
            </Label>
          </div>
          <Button variant="ghost" size="sm">
            {t("order.common.view")}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Controller
              control={control}
              name="agreements.payment"
              render={({ field }) => (
                <Checkbox checked={!!field.value} onCheckedChange={(v) => field.onChange(!!v)} id="payment" />
              )}
            />
            <Label htmlFor="payment" className="ml-3 cursor-pointer">
              {t("order.agreements.payment")}
            </Label>
          </div>
          <Button variant="ghost" size="sm">
            {t("order.common.view")}
          </Button>
        </div>
      </div>
    </Card>
  );
}
