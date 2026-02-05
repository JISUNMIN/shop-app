// src/app/product/[productId]/_components/QuantityRow.tsx
"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

export default function QuantityControl({
  quantity,
  maxAvailable,
  cartQty,
  stock,
  onQuantityInput,
  onQuantityChange,
}: {
  quantity: number;
  maxAvailable: number;
  cartQty: number;
  stock: number;
  onQuantityInput: (value: string) => void;
  onQuantityChange: (delta: number) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="w-20 text-sm font-medium text-gray-700">{t("quantity")}</span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onQuantityChange(-1)}
          disabled={quantity <= 1}
          className="h-10 w-10"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <Input
          type="number"
          className="h-10 w-16 text-center border border-gray-300"
          value={quantity === 0 ? "" : quantity}
          min={1}
          max={maxAvailable}
          disabled={maxAvailable <= 0}
          onChange={(e) => onQuantityInput(e.target.value)}
        />

        <Button
          variant="outline"
          size="icon"
          onClick={() => onQuantityChange(1)}
          disabled={quantity >= maxAvailable}
          className="h-10 w-10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {maxAvailable <= 0 && (
        <p className="text-sm text-gray-500">{t("cartLimitReached", { count: cartQty })}</p>
      )}

      {maxAvailable > 0 && maxAvailable < stock && (
        <p className="text-sm text-gray-500">{t("maxPurchaseLimit", { stock, cart: cartQty })}</p>
      )}
    </div>
  );
}
