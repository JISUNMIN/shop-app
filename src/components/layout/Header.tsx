// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { Search, ShoppingCart, Bot, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCart from "@/hooks/useCart";
import { useLangStore } from "@/store/langStore";
import { useTranslation } from "react-i18next";
import { LogoutButton } from "../common/LogoutButton";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const { listData: cartItems } = useCart();
  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const { lang, toggleLang } = useLangStore();
  const { t } = useTranslation();
  const user = session?.user;

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
        <Bot className="w-8 h-8" />
        <span className="hidden sm:inline-block font-bold">RoboShop</span>
      </Link>

      {isMobile ? (
        <div className="flex flex-col flex-1 px-4 space-y-3">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("searchPlaceholderMobile")}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={toggleLang}
            >
              <Globe className="h-4 w-4" />
              <span>{lang}</span>
            </Button>

            <Link href="/cart" className="relative">
              <Button variant="ghost" size="sm">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-[10px]"
                  >
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* 검색바 */}
          <div className="flex flex-1 items-center justify-center px-4">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row flex-1 max-w-2xl mx-4 sm:mx-6 items-center sm:items-stretch space-y-2 sm:space-y-0 sm:space-x-2"
            >
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("searchPlaceholderDesktop")}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button type="submit" size="sm" className="w-full sm:w-auto">
                {t("searchButton")}
              </Button>
            </form>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={toggleLang}
            >
              <Globe className="h-4 w-4" />
              <span>{lang}</span>
            </Button>

            {!user && (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="px-2">
                  {t("auth.login")}
                </Button>
              </Link>
            )}

            <span className="text-gray-300">|</span>
            <Link href="/signup">
              <Button variant="ghost" size="sm" className="px-2 font-semibold">
                {t("auth.signup")}
              </Button>
            </Link>

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
                <span className="hidden sm:ml-2 sm:inline">{t("cart")}</span>
              </Button>
            </Link>

            <LogoutButton />
          </div>
        </>
      )}
    </header>
  );
}
