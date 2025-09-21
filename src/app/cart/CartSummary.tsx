// src/app/cart/CartSummary.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ko-KR").format(price);

  const isFreeShipping = totalPrice >= 30000;

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-lg">주문 요약</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>상품 ({totalItems}개)</span>
            <span>{formatPrice(totalPrice)}원</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>배송비</span>
            {isFreeShipping ? (
              <div className="text-right">
                <span className="line-through text-muted-foreground">
                  {formatPrice(shippingFee)}원
                </span>
                <span className="ml-2 text-green-600 font-medium">무료</span>
              </div>
            ) : (
              <span>{formatPrice(shippingFee)}원</span>
            )}
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>총 결제금액</span>
          <span className="text-primary">{formatPrice(finalPrice)}원</span>
        </div>

        {!isFreeShipping && (
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
            <span className="text-primary font-medium">
              {formatPrice(30000 - totalPrice)}원
            </span>{" "}
            더 구매하시면 무료배송!
          </div>
        )}

        <Button
          size="lg"
          className="w-full"
          onClick={onOrder}
          disabled={totalItems === 0}
        >
          주문하기
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• 평일 오후 2시 이전 주문 시 당일 출고</p>
          <p>• 제주/도서산간 지역 배송비 별도</p>
          <p>• 로봇 설치 서비스는 별도 문의</p>
        </div>
      </CardContent>
    </Card>
  );
}
