// src/app/product/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LocalizedText, Product } from "@/types";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { formatPrice, formatString } from "@/utils/helper";
import { Heart, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import useCart from "@/hooks/useCart";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import {
  addLocalWishlist,
  getLocalWishlist,
  removeLocalWishlist,
} from "@/utils/storage/wishlistLocal";
import useWishlist from "@/hooks/useWishlist";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as keyof LocalizedText;
  const shouldReduceMotion = useReducedMotion();
  const { addToCartMutate, isAddPending } = useCart();
  const { data: session } = useSession();
  const user = session?.user;

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const { listData, addWishlistMutate, deleteWishlistMutate } = useWishlist();

  const isSoldOut = product.stock === 0;

  const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const next = !isWishlisted;
    setIsWishlisted(next);

    const productId = Number(product.id);

    try {
      // 비로그인 유저
      if (!user) {
        if (next) addLocalWishlist(productId);
        else removeLocalWishlist(productId);
        window.dispatchEvent(new Event("wishlist:changed"));
        return;
      }

      // 로그인 유저
      if (next) {
        addWishlistMutate(
          { productId: product.id },
          {
            onError: (err) => {
              console.error(err);
              setIsWishlisted(false);
            },
          },
        );
      } else {
        deleteWishlistMutate(
          { productId: product.id },
          {
            onError: (err) => {
              console.error(err);
              setIsWishlisted(true);
            },
          },
        );
      }
    } catch (error) {
      console.error(error);
      setIsWishlisted(!next);

      if (!user) {
        if (!next) addLocalWishlist(productId);
        else removeLocalWishlist(productId);
      }
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isSoldOut) return;

    addToCartMutate(
      {
        productId: product.id,
        quantity: 1,
      },
      {
        onSuccess: () => {
          toast.success(t("addedToCart"), {
            description: t("addedToCartDescription", {
              name: product.name[lang],
              quantity: 1,
            }),
          });
        },
      },
    );
  };

  useEffect(() => {
    const list = user ? listData?.productIds : getLocalWishlist();
    setIsWishlisted(list?.some((item) => item === product.id) ?? false);
  }, [listData]);

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group"
      onMouseEnter={() => setShowQuickView(true)}
      onMouseLeave={() => setShowQuickView(false)}
    >
      <Link href={`/product/${product.id}`}>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full py-0">
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={product.images[0] || "/placeholder.jpg"}
              alt={product.name[lang] ?? "Product image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />

            {/* 품절 표시 */}
            {isSoldOut && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Badge variant="destructive" className="text-sm">
                  {t("soldOut")}
                </Badge>
              </div>
            )}

            {/* 재고 부족 표시 */}
            {!isSoldOut && product.stock <= 10 && (
              <div className="absolute right-2 top-2">
                <Badge variant="secondary" className="text-xs">
                  {t("onlyLeft", { count: product.stock })}
                </Badge>
              </div>
            )}

            {/* 호버 시 버튼들 */}
            <AnimatePresence>
              {showQuickView && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-2 left-4 right-4 flex gap-2 z-20"
                >
                  <Button
                    className="flex-1 h-8 px-3 text-sm bg-white text-black hover:bg-gray-100"
                    onClick={handleAddToCartClick}
                    disabled={isSoldOut}
                    aria-disabled={isSoldOut}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1.5" />
                    {isAddPending ? t("addingToCart") : t("addToCart")}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 찜하기 버튼 */}
            <button
              onClick={handleWishlistClick}
              className="absolute top-3 left-3 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
              aria-label="Wishlist"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </button>
          </div>

          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-medium line-clamp-2 text-sm leading-tight">
                {product.name[lang]}
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-primary">
                    {formatString(t("price"), {
                      price: formatPrice(product.price ?? 0, lang),
                    })}
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
