"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import useProducts from "@/hooks/useProducts";
import useCart from "@/hooks/useCart";
import ProductGallery from "@/app/product/[productId]/ProductGallery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import ProductDetailSkeleton from "../ProductDetailSkeleton";
import { Input } from "@/components/ui/input";
import { useLangStore } from "@/store/langStore";
import { formatPrice } from "@/utils/helper";
import { useTranslation } from "react-i18next";

export default function ProductPage() {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const params = useParams();
  const productId = Number(params?.productId);
  const { lang } = useLangStore();
  const { t } = useTranslation();

  const { detailData, isDetailLoading, detailError } = useProducts(undefined, productId);
  const { listData: cartItems, addToCartMutate, isAddPending } = useCart();

  const getCartQuantity = () => {
    const item = cartItems?.find((i) => Number(i.product.id) === productId);
    return item?.quantity || 0;
  };

  const handleQuantityInput = (value: string) => {
    if (!detailData) return;

    if (value === "") {
      setQuantity(0);
      return;
    }

    // 숫자가 아니거나 소수점 포함 시 무시
    if (!/^\d+$/.test(value)) return;

    const num = Number(value);
    const totalQuantity = num + getCartQuantity();

    if (totalQuantity > detailData.stock) {
      setQuantity(detailData.stock - getCartQuantity());
    } else if (num < 1) {
      setQuantity(1);
    } else {
      setQuantity(num);
    }
  };

  const handleQuantityChange = (delta: number) => {
    if (!detailData) return;

    const newQuantity = quantity + delta;
    const maxAllowed = detailData.stock - getCartQuantity();
    const clamped = Math.max(1, Math.min(maxAllowed, newQuantity));
    setQuantity(clamped);
  };

  const handleAddToCart = () => {
    if (!detailData) return;

    const totalQuantity = quantity + getCartQuantity();
    if (totalQuantity > detailData.stock) {
      toast.error(
        t("maxOrderLimit", {
          stock: detailData.stock,
          cart: getCartQuantity(),
        }),
      );
      return;
    }

    addToCartMutate(
      {
        productId: detailData.id,
        quantity,
      },
      {
        onSuccess: () => {
          toast.success(t("addedToCart"), {
            description: t("addedToCartDescription", {
              name: detailData.name[lang] ?? "",
              quantity,
            }),
          });
        },
      },
    );
  };

  if (isDetailLoading) return <ProductDetailSkeleton />;

  if (detailError || !detailData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1400px] mx-auto p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600">{t("productNotFound")}</h2>
              <p className="mt-2 text-muted-foreground">{t("productDeleted")}</p>
              <Button onClick={() => router.push("/")} className="mt-4">
                {t("goHome")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOutOfStock = detailData.stock === 0;
  const isLowStock = detailData.stock > 0 && detailData.stock <= 10;
  const maxAvailable = detailData.stock - getCartQuantity();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto p-6">
        {/* 뒤로가기 버튼 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{t("back")}</span>
          </button>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* 상품 이미지 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ProductGallery images={detailData.images} productName={detailData.name[lang] ?? ""} />
          </motion.div>

          {/* 상품 정보 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* 카테고리 */}
            {detailData.category && (
              <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">
                {detailData.category[lang] ?? ""}
              </Badge>
            )}

            <h1 className="text-3xl font-semibold">{detailData.name[lang] ?? ""}</h1>

            <p className="text-3xl font-semibold">
              {t("price", { price: formatPrice(detailData.price, lang) })}
            </p>

            {/* 재고 상태 */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <Badge variant="destructive" className="px-3 py-1 text-sm">
                  {t("outOfStock")}
                </Badge>
              ) : isLowStock ? (
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 px-3 py-1 text-sm">
                  {t("lowStock", { stock: detailData.stock })}
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1 text-sm">
                  {t("inStock", { stock: detailData.stock })}
                </Badge>
              )}
            </div>

            {detailData.description && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">{t("productDescription")}</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {detailData.description[lang] ?? ""}
                </p>
              </div>
            )}

            {/* 수량 */}
            <div>
              <div className="flex items-center gap-3">
                <span className="w-20 text-sm font-medium text-gray-700">{t("quantity")}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <Input
                  type="number"
                  className="w-16 text-center border border-gray-300 rounded h-10 p-1"
                  value={quantity === 0 ? "" : quantity}
                  min={1}
                  max={maxAvailable}
                  disabled={maxAvailable <= 0}
                  onChange={(e) => handleQuantityInput(e.target.value)}
                  onBlur={() => {
                    if (quantity < 1) setQuantity(1);
                    if (quantity > maxAvailable) setQuantity(maxAvailable);
                  }}
                />

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= maxAvailable}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* 제한 문구 */}
              {maxAvailable <= 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  {t("cartLimitReached", { count: getCartQuantity() })}
                </p>
              )}

              {maxAvailable > 0 && maxAvailable < detailData.stock && (
                <p className="text-sm text-gray-500 mt-2">
                  {t("maxPurchaseLimit", { stock: detailData.stock, cart: getCartQuantity() })}
                </p>
              )}
            </div>

            {/* 총 가격 */}
            <div className="py-4 border-t border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium">{t("totalPrice")}</span>
                <span className="text-2xl font-semibold">
                  {t("price", { price: formatPrice(detailData.price * (quantity || 1), lang) })}
                </span>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              {/* 장바구니 */}
              <Button size="lg" className="flex-1 bg-black text-white hover:bg-gray-800 gap-2">
                <ShoppingCart className="h-5 w-5" />
                {t("addToCart")}
              </Button>

              {/* 찜 버튼 */}
              <Button size="lg" variant="outline" className="w-14 border-gray-300 hover:bg-gray-50">
                ♥
              </Button>
            </div>

            {/* 바로구매 */}
            <Button size="lg" className="w-full bg-blue-600 text-white hover:bg-blue-700">
              {t("order.buyNow")}
            </Button>

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
          </motion.div>
        </div>
      </div>
    </div>
  );
}
