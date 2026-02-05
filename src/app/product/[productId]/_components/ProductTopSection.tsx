// src/app/product/[productId]/_components/ProductTopSection.tsx
"use client";

import { motion } from "framer-motion";
import ProductGallery from "@/app/product/[productId]/ProductGallery";
import ProductSummaryPanel from "@/app/product/[productId]/_components/ProductSummaryPanel";
import { useTranslation } from "react-i18next";
import { LangCode } from "@/types";

export default function ProductTopSection({
  detailData,
  quantity,
  maxAvailable,
  getCartQuantity,
  isAddPending,
  onQuantityInput,
  onQuantityChange,
  onAddToCart,
  productId,
}: {
  detailData: any;
  quantity: number;
  maxAvailable: number;
  getCartQuantity: () => number;
  isAddPending: boolean;
  onQuantityInput: (value: string) => void;
  onQuantityChange: (delta: number) => void;
  onAddToCart: () => void;
  productId: string;
}) {
  const { i18n } = useTranslation();
  const lang = i18n.language as LangCode;

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      {/* 갤러리 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ProductGallery images={detailData.images} productName={detailData.name[lang] ?? ""} />
      </motion.div>

      {/* 구매 요약 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ProductSummaryPanel
          detailData={detailData}
          quantity={quantity}
          maxAvailable={maxAvailable}
          getCartQuantity={getCartQuantity}
          isAddPending={isAddPending}
          onQuantityInput={onQuantityInput}
          onQuantityChange={onQuantityChange}
          onAddToCart={onAddToCart}
          productId={productId}
        />
      </motion.div>
    </div>
  );
}
