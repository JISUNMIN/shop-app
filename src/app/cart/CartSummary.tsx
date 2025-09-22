"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/context/TranslationContext";
import { useLangStore } from "@/store/langStore";
import { formatString, formatPrice as helperFormatPrice } from "@/utils/helper";

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
  shippingFee: number;
  finalPrice: number;
  onOrder: () => void;
}

export default function CartSummary({
  totalItems,
  totalPrice,
  shippingFee,
  finalPrice,
  onOrder,
}: CartSummaryProps) {
  const { lang } = useLangStore();
  const t = useTranslation();

  const isFreeShipping = totalPrice >= 30000;

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-lg">{t.orderSummary}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{formatString(t.itemsCount, { count: totalItems })}</span>
            <span>
              {formatString(t.price, {
                price: helperFormatPrice(totalPrice, lang),
              })}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>{t.shippingFee}</span>
            {isFreeShipping ? (
              <div className="text-right">
                <span className="line-through text-muted-foreground">
                  {formatString(t.price, {
                    price: helperFormatPrice(shippingFee, lang),
                  })}
                </span>
                <span className="ml-2 text-green-600 font-medium">
                  {t.free}
                </span>
              </div>
            ) : (
              <span>
                {formatString(t.price, {
                  price: helperFormatPrice(shippingFee, lang),
                })}
              </span>
            )}
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>{t.totalPayment}</span>
          <span className="text-primary">
            {formatString(t.price, {
              price: helperFormatPrice(finalPrice, lang),
            })}
          </span>
        </div>

        {!isFreeShipping && (
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
            <span className="text-primary font-medium">
              {formatString(t.price, {
                price: helperFormatPrice(30000 - totalPrice, lang),
              })}
            </span>{" "}
            {t.freeShippingMessage}
          </div>
        )}

        <Button
          size="lg"
          className="w-full"
          onClick={onOrder}
          disabled={totalItems === 0}
        >
          {t.order}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>{t.deliveryNote1}</p>
          <p>{t.deliveryNote2}</p>
          <p>{t.deliveryNote3}</p>
        </div>
      </CardContent>
    </Card>
  );
}
