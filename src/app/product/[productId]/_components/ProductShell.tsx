"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import useProducts from "@/hooks/useProducts";
import useCart from "@/hooks/useCart";

import ProductDetailSkeleton from "./ProductDetailSkeleton";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

import ProductTopSection from "./ProductTopSection";
import ProductDetailTabs from "./ProductDetailTabs";
import { LangCode } from "@/types";
import RecommendedProductsSection from "@/app/product/[productId]/_components/RecommendedProductsSection";

export default function ProductShell({ productId }: { productId: number }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);

  const { t, i18n } = useTranslation();
  const lang = i18n.language as LangCode;

  const {
    listData: ProductList,
    detailData,
    isDetailLoading,
    detailError,
  } = useProducts(undefined, productId);
  const { listData: cartItems, addToCartMutate, isAddPending } = useCart();

  const recommendedProducts =
    ProductList?.data?.filter((p) => p.id !== productId)?.slice(0, 4) ?? [];

  const getCartQuantity = () => {
    const item = cartItems?.find((i) => i.product.id === productId);
    return item?.quantity || 0;
  };

  const handleQuantityInput = (value: string) => {
    if (!detailData) return;

    if (value === "") {
      setQuantity(0);
      return;
    }

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
      { productId: detailData.id, quantity },
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

  const maxAvailable = detailData.stock - getCartQuantity();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto p-6">
        {/* 뒤로가기 */}
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

        {/* 상단: 갤러리 + 우측 구매 정보 */}
        <ProductTopSection
          detailData={detailData}
          quantity={quantity}
          maxAvailable={maxAvailable}
          getCartQuantity={getCartQuantity}
          isAddPending={isAddPending}
          onQuantityInput={handleQuantityInput}
          onQuantityChange={handleQuantityChange}
          onAddToCart={handleAddToCart}
          productId={productId}
        />

        {/* 하단: 탭(상세/사양/가이드/배송) */}
        <ProductDetailTabs detailData={detailData} isDetailLoading={isDetailLoading} />
        {/* 추천 상품*/}
        <RecommendedProductsSection productList={recommendedProducts} />
      </div>
    </div>
  );
}
