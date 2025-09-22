// src/app/product/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { motion } from "framer-motion";
import { formatString } from "@/utils/helper";
import { useTranslation } from "@/context/TranslationContext";
import { useLangStore } from "@/store/langStore";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const t = useTranslation();
  const { lang } = useLangStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/product/${product.id}`}>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full">
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={product.images[0] || "/placeholder.jpg"}
              alt={product.name[lang]}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />

            {/* 품절 표시 */}
            {product.stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Badge variant="destructive" className="text-sm">
                  {t.soldOut}
                </Badge>
              </div>
            )}

            {/* 재고 부족 표시 */}
            {product.stock > 0 && product.stock <= 10 && (
              <div className="absolute right-2 top-2">
                <Badge variant="secondary" className="text-xs">
                  {formatString(t.onlyLeft, { count: product.stock })}
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-medium line-clamp-2 text-sm leading-tight">
                {product.name[lang]}
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-primary">
                    {formatString(t.price, { price: product.price })}
                  </span>
                </div>
              </div>

              {product.category && (
                <Badge variant="outline" className="text-xs">
                  {product.category[lang]}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
