// app/order/_components/sections/OrderSummarySection.tsx
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { OrderSummaryContentSkeleton } from "./OrderSummarySkeleton";

interface OrderSummarySectionProps {
  isLoading: boolean;

  subtotal: number;
  deliveryFee: number;
  freeShippingThreshold: number;

  couponDiscount: number;
  pointsDiscount: number;
  finalAmount: number;

  canPay: boolean;
  hasOutOfStock: boolean;

  isPaying?: boolean;
  onClickPay: () => void;
}

export function OrderSummarySection({
  isLoading,
  subtotal,
  deliveryFee,
  freeShippingThreshold,
  couponDiscount,
  pointsDiscount,
  finalAmount,
  canPay,
  hasOutOfStock,
  isPaying = false,
  onClickPay,
}: OrderSummarySectionProps) {
  const { t } = useTranslation();

  return (
    <div className="sticky top-24">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">{t("order.summary.title")}</h2>

        {isLoading ? (
          <OrderSummaryContentSkeleton />
        ) : (
          <>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-gray-600">
                <span>{t("order.summary.subtotal")}</span>
                <span>
                  {subtotal.toLocaleString()}
                  {t("order.common.won")}
                </span>
              </div>

              <div className="flex items-center justify-between text-gray-600">
                <span>{t("order.summary.deliveryFee")}</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">{t("order.summary.free")}</span>
                  ) : (
                    `+${deliveryFee.toLocaleString()}${t("order.common.won")}`
                  )}
                </span>
              </div>

              {subtotal < freeShippingThreshold && deliveryFee > 0 && (
                <div className="text-xs text-gray-500 pl-4">
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  {t("order.summary.freeShippingHint", {
                    remain: (freeShippingThreshold - subtotal).toLocaleString(),
                  })}
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex items-center justify-between text-red-600">
                  <span>{t("order.summary.couponDiscount")}</span>
                  <span>
                    -{couponDiscount.toLocaleString()}
                    {t("order.common.won")}
                  </span>
                </div>
              )}

              {pointsDiscount > 0 && (
                <div className="flex items-center justify-between text-red-600">
                  <span>{t("order.summary.pointsDiscount")}</span>
                  <span>
                    -{pointsDiscount.toLocaleString()}
                    {t("order.common.won")}
                  </span>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between text-xl font-bold mb-2">
              <span>{t("order.summary.finalAmount")}</span>
              <span className="text-blue-600">
                {finalAmount.toLocaleString()}
                {t("order.common.won")}
              </span>
            </div>

            <Button
              onClick={onClickPay}
              className="w-full h-14 text-lg font-bold"
              disabled={!canPay || hasOutOfStock || isPaying}
            >
              {t("order.summary.pay", { amount: finalAmount.toLocaleString() })}
            </Button>

            {hasOutOfStock && (
              <div className="mt-3 p-3 bg-red-50 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{t("order.summary.outOfStockBanner")}</p>
              </div>
            )}

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-sm">{t("order.summary.infoTitle")}</h3>
              <div className="space-y-1 text-xs text-gray-600">
                <p>{t("order.summary.info1")}</p>
                <p>{t("order.summary.info2")}</p>
                <p>{t("order.summary.info3")}</p>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
