"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, ShoppingCart, Heart } from "lucide-react";
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

export default function ProductPage() {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const params = useParams();
  const productId = Number(params?.productId);

  const { detailData, isDetailLoading, detailError } = useProducts(
    undefined,
    productId
  );

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

    const num = Number(value);
    if (isNaN(num)) return;

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

  const handleAddToCart = async () => {
    if (!detailData) return;

    const totalQuantity = quantity + getCartQuantity();
    if (totalQuantity > detailData.stock) {
      toast.error(
        `최대 주문 가능 수량은 ${
          detailData.stock
        }개입니다. 장바구니에 이미 ${getCartQuantity()}개 담겨 있습니다.`
      );
      return;
    }

    try {
      await addToCartMutate({
        productId: detailData.id,
        quantity,
      });

      toast.success("장바구니에 추가되었습니다", {
        description: `${detailData.name} ${quantity}개가 장바구니에 추가되었습니다.`,
      });
    } catch (error: any) {
      toast.error("오류가 발생했습니다", {
        description: error.message || "장바구니에 추가할 수 없습니다.",
      });
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ko-KR").format(price);

  if (isDetailLoading) return <ProductDetailSkeleton />;

  if (detailError || !detailData) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600">
              상품을 찾을 수 없습니다
            </h2>
            <p className="mt-2 text-muted-foreground">
              요청하신 상품이 존재하지 않거나 삭제되었습니다.
            </p>
            <Button onClick={() => router.push("/")} className="mt-4">
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isOutOfStock = detailData.stock === 0;
  const isLowStock = detailData.stock > 0 && detailData.stock <= 10;
  const maxAvailable = detailData.stock - getCartQuantity();

  return (
    <div className="container py-8">
      {/* 뒤로가기 버튼 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </Button>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 상품 이미지 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ProductGallery
            images={detailData.images}
            productName={detailData.name}
          />
        </motion.div>

        {/* 상품 정보 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {detailData.category && (
            <Badge variant="outline">{detailData.category}</Badge>
          )}
          <h1 className="text-2xl font-bold lg:text-3xl">{detailData.name}</h1>

          <div className="text-3xl font-bold text-primary">
            {formatPrice(detailData.price)}원
          </div>

          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <Badge variant="destructive" className="px-3 py-1 text-sm">
                품절
              </Badge>
            ) : isLowStock ? (
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                재고 부족({detailData.stock}개)
              </Badge>
            ) : (
              <Badge variant="default" className="px-3 py-1 text-sm">
                재고 충분 ({detailData.stock}개)
              </Badge>
            )}
          </div>

          {detailData.description && (
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-2 font-semibold">상품 설명</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {detailData.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* 수량 선택 및 장바구니 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium">수량:</span>
              <div className="flex items-center space-x-2">
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
                  className="w-16 text-center rounded border border-gray-300 p-1"
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
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-lg font-medium">총 가격:</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(detailData.price * (quantity || 1))}원
              </span>
            </div>

            <div className="grid gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddPending || maxAvailable <= 0}
                className="gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {isAddPending ? "추가 중..." : "장바구니에 담기"}
              </Button>

              {maxAvailable <= 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  장바구니에 이미 {getCartQuantity()}개 담겨 있어, 추가로 담을
                  수 없습니다.
                </p>
              )}

              {maxAvailable > 0 && maxAvailable < detailData.stock && (
                <p className="text-sm text-muted-foreground mt-1">
                  최대 {detailData.stock}개까지 구매 가능하며, 현재 장바구니에{" "}
                  {getCartQuantity()}개 담겨 있습니다.
                </p>
              )}
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <h3 className="mb-2 font-semibold">배송 정보</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• 주문 확인 후 1~3일 내 발송</p>
                <p>
                  • 제주/도서산간 지역은 배송 기간이 추가로 소요될 수 있습니다.
                </p>
                <p>
                  • 로봇 제품 특성상 안전한 포장 및 배송을 위해 별도의 운송
                  절차가 진행됩니다.
                </p>
                <p>• 조립 및 설치 안내는 발송 시 별도 안내됩니다.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <div className="relative border-2 border-primary-500 rounded-xl p-6 mt-6 bg-primary-50/20 text-center text-primary-700 font-medium shadow-sm">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-sm font-semibold">
          상품 상세페이지 영역
        </span>
        여기에 상품 상세페이지 콘텐츠가 들어갑니다.
      </div>
    </div>
  );
}
