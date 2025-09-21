// src/app/cart/EmptyCart.tsx
"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyCart() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
      <h2 className="text-xl font-semibold mb-2">장바구니가 비어있습니다</h2>
      <p className="text-muted-foreground mb-6 text-center">
        마음에 드는 로봇을 장바구니에 담아보세요
      </p>
      <Button onClick={() => router.push("/")} size="lg">
        로봇 쇼핑하러 가기
      </Button>
    </div>
  );
}
