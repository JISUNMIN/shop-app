// app/order/_components/sections/OrderPaymentSection.tsx
import { CreditCard, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Controller, useFormContext } from "react-hook-form";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import type { OrderFormValues, PaymentMethod } from "@/app/order/_components/OrderShell";

export function OrderPaymentSection() {
  const { t } = useTranslation();
  const { control } = useFormContext<OrderFormValues>();

  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5" />
        <h2 className="text-lg md:text-xl font-bold">{t("order.payment.title")}</h2>
      </div>

      <Controller
        name="paymentMethod"
        control={control}
        render={({ field }) => (
          <RadioGroup value={field.value} onValueChange={(v) => field.onChange(v as PaymentMethod)}>
            <div className="space-y-3">
              <div
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer ${
                  field.value === "card" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex-1 ml-3 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">{t("order.payment.methods.card")}</span>
                  </div>
                </Label>
              </div>

              <div
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer ${
                  field.value === "bank" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="flex-1 ml-3 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    <span className="font-medium">{t("order.payment.methods.bank")}</span>
                  </div>
                </Label>
              </div>

              <div
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer ${
                  field.value === "kakao" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="kakao" id="kakao" />
                <Label htmlFor="kakao" className="flex-1 ml-3 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-yellow-400 rounded" />
                    <span className="font-medium">{t("order.payment.methods.kakao")}</span>
                  </div>
                </Label>
              </div>

              <div
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer ${
                  field.value === "naver" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="naver" id="naver" />
                <Label htmlFor="naver" className="flex-1 ml-3 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded" />
                    <span className="font-medium">{t("order.payment.methods.naver")}</span>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        )}
      />
    </Card>
  );
}
