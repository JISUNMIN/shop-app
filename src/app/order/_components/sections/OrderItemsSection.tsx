// app/order/_components/sections/OrderItemsSection.tsx
import { Package, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { OrderItem } from "@/types";

export function OrderItemsSection({ orderItems }: { orderItems: OrderItem[] }) {
  const { t } = useTranslation();

  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5" />
        <h2 className="text-lg md:text-xl font-bold">{t("order.items.title")}</h2>
        <Badge variant="outline">{t("order.items.count", { count: orderItems.length })}</Badge>
      </div>

      <div className="space-y-4">
        {orderItems.map((item) => {
          const isOut = item.quantity > item.stock;

          return (
            <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1 line-clamp-2">{item.name}</h3>

                <p className="text-sm text-gray-500 mb-2">
                  {t("order.items.qty", { qty: item.quantity })}
                  {isOut && (
                    <span className="text-red-500 ml-1 inline-flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {t("order.items.outOfStock", { stock: item.stock })}
                    </span>
                  )}
                </p>

                <p className="text-lg font-bold text-blue-600">
                  {(item.price * item.quantity).toLocaleString()}
                  {t("order.common.won")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
