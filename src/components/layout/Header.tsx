// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { Search, ShoppingCart, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCart from "@/hooks/useCart";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const { listData: cartItems } = useCart();
  const cartItemCount =
    cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize(); 
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="flex w-full items-center justify-between py-4 px-6 border-b bg-background/95">
      {/* 로고 */}
      <Link href="/" className="flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="hidden sm:inline-block font-bold">RoboShop</span>
      </Link>

      {/* 검색바 */}
      <div className="flex flex-1 items-center justify-center px-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row flex-1 max-w-md mx-4 sm:mx-6 items-center sm:items-stretch space-y-2 sm:space-y-0 sm:space-x-2"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={
                isMobile ? "로봇 검색" : "어떤 로봇을 찾고 계신가요?"
              }
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm" className="w-full sm:w-auto">
            검색
          </Button>
        </form>
      </div>

      {/* 장바구니 */}
      <Link href="/cart">
        <Button variant="ghost" size="sm" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartItemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-[10px]"
            >
              {cartItemCount > 99 ? "99+" : cartItemCount}
            </Badge>
          )}
          <span className="hidden sm:ml-2 sm:inline">장바구니</span>
        </Button>
      </Link>
    </header>
  );
}
