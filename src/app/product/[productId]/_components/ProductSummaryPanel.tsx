// src/app/product/[productId]/_components/ProductPurchasePanel.tsx
"use client";

import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/helper";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";

import QuantityRow from "./QuantityControl";
import { LangCode, ProductDetailsProps } from "@/types";
import { useRouter } from "next/navigation";

export default function ProductSummaryPanel({
  detailData,
  quantity,
  maxAvailable,
  getCartQuantity,
  isAddPending,
  onQuantityInput,
  onQuantityChange,
  onAddToCart,
  productId,
}: ProductDetailsProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as LangCode;
  const router = useRouter();

  const isOutOfStock = detailData.stock === 0;
  const isLowStock = detailData.stock > 0 && detailData.stock <= 10;

  const handleOrder = () => {
    router.push(`/order?productId=${productId}&quantity=${quantity}`);
  };

  return (
    <div className="space-y-6">
      {/* 카테고리 뱃지*/}
      {detailData.category && (
        <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">
          {detailData.category[lang] ?? ""}
        </Badge>
      )}

      <h1 className="text-3xl font-semibold">{detailData.name[lang] ?? ""}</h1>
      <p className="text-3xl font-semibold">
        {t("price", { price: formatPrice(detailData.price, lang) })}
      </p>

      {/* 재고 Badge*/}
      <div className="flex items-center gap-2">
        {isOutOfStock ? (
          <Badge variant="destructive" className="px-3 py-1 text-sm">
            {t("outOfStock")}
          </Badge>
        ) : isLowStock ? (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 px-3 py-1 text-sm">
            {t("lowStock", { stock: detailData?.stock })}
          </Badge>
        ) : (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1 text-sm">
            {t("inStock", { stock: detailData?.stock })}
          </Badge>
        )}
      </div>

      {/* 상품 설명 */}
      {detailData.description && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">{t("productDescription")}</h3>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {detailData.description[lang] ?? ""}
          </p>
        </div>
      )}

      {/* 수량 변경 */}
      <QuantityRow
        quantity={quantity}
        maxAvailable={maxAvailable}
        cartQty={getCartQuantity()}
        stock={detailData.stock}
        onQuantityInput={onQuantityInput}
        onQuantityChange={onQuantityChange}
      />

      {/* 총 가격 */}
      <div className="py-4 border-t border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium">{t("totalPrice")}</span>
          <span className="text-2xl font-semibold">
            {t("price", { price: formatPrice(detailData.price * (quantity || 1), lang) })}
          </span>
        </div>
      </div>

      {/* 버튼 (장바구니, 구매하기) */}
      <div className="grid gap-3">
        <Button
          size="lg"
          onClick={onAddToCart}
          disabled={isOutOfStock || isAddPending || maxAvailable <= 0}
          className="gap-2 bg-black text-white hover:bg-gray-800"
        >
          <ShoppingCart className="h-5 w-5" />
          {isAddPending ? t("addingToCart") : t("addToCart")}
        </Button>

        <Button
          onClick={handleOrder}
          size="lg"
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          {t("order.buyNow")}
        </Button>
      </div>

      {/* 배송 안내 */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-2 font-semibold">{t("deliveryInfo")}</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>{t("deliveryInfo1")}</p>
            <p>{t("deliveryInfo2")}</p>
            <p>{t("deliveryInfo3")}</p>
            <p>{t("deliveryInfo4")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
