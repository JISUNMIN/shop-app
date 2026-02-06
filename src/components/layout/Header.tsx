// components/layout/Header.tsx
"use client";

import Link from "next/link";
import { Search, ShoppingCart, Bot, Globe, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useCart from "@/hooks/useCart";
import { useLangStore } from "@/store/langStore";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarContent, { TabType } from "@/components/common/SidebarContent";
import MypageButton from "../common/MypageButton";
import { menuItems } from "@/app/mypage/_components/menuItems";
import WishlistSheet from "@/components/common/WishlistSheet";
import RoboShopLogo from "../common/RoboShopLogo";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isMobile, setIsMobile] = useState(false);
  const { listData: cartItems } = useCart();
  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const { lang, toggleLang } = useLangStore();
  const { t } = useTranslation();
  const user = session?.user;
  const activeTab = (searchParams.get("tab") as TabType) || "dashboard";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/");
    }
  };

  const handleSelectTab = (tab: TabType) => {
    if (pathname === "/mypage") {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.replace(`/mypage?${params.toString()}`);
    } else {
      router.push(`/mypage?tab=${tab}`);
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div
        className="absolute inset-x-0 bottom-0 h-[1px] pointer-events-none"
        style={{
          backgroundColor: "color-mix(in oklch, var(--button-bg) 18%, transparent)",
        }}
      />

      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        {/* 로고 + 모바일 햄버거 */}
        <div className="flex items-center space-x-2">
          {user && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-80 overflow-y-auto">
                <div className="mt-12">
                  <SidebarContent
                    menuItems={menuItems}
                    activeTab={activeTab}
                    onSelectTab={handleSelectTab}
                    setMobileMenuOpen={setMobileMenuOpen}
                  />
                </div>
              </SheetContent>
            </Sheet>
          )}

          <RoboShopLogo
            className="group flex items-center space-x-2"
            botClassName="w-5 h-5"
            textClassName="text-base"
            hideTextOnMobile
          />
        </div>

        {isMobile ? (
          <div className="flex flex-col flex-1 px-4 space-y-3">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder={t("searchPlaceholderMobile")}
                  className="pl-9 bg-white border-gray-200 shadow-none"
                  style={
                    {
                      "--tw-ring-color": "color-mix(in oklch, var(--button-bg) 35%, transparent)",
                    } as React.CSSProperties
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <div className="flex justify-end space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1"
                onClick={toggleLang}
              >
                <Globe className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-700">{lang}</span>
              </Button>

              <WishlistSheet />

              <Link href="/cart" className="relative">
                <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                  <ShoppingCart className="h-5 w-5 text-gray-700" />
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
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder={t("searchPlaceholderDesktop")}
                    className="pl-9 bg-white border-gray-200 shadow-none"
                    style={
                      {
                        "--tw-ring-color": "color-mix(in oklch, var(--button-bg) 35%, transparent)",
                      } as React.CSSProperties
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Button type="submit" size="sm" className="w-full sm:w-auto">
                  {t("searchButton")}
                </Button>
              </form>
            </div>

            {/* 지구본(언어변경) */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1"
                onClick={toggleLang}
              >
                <Globe className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-700">{lang}</span>
              </Button>
              {/* 로그인*/}
              {!user && (
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-medium text-gray-700">
                    {t("auth.login")}
                  </Button>
                </Link>
              )}
              {/* 회원가입 */}
              {!user && (
                <>
                  <span className="text-gray-200">|</span>
                  <Link href="/signup">
                    <Button variant="outline" size="sm" className="px-3 font-semibold">
                      {t("auth.signup")}
                    </Button>
                  </Link>
                </>
              )}
              {/* 마이페이지 */}

              {user && <MypageButton />}
              {/* 찜하기 */}

              <WishlistSheet />
              {/* 장바구니 */}
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative hover:bg-gray-100">
                  <ShoppingCart className="h-5 w-5 text-gray-700" />
                  {cartItemCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-[10px]"
                    >
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </Badge>
                  )}
                  <span className="hidden sm:ml-2 sm:inline text-gray-800 font-medium">
                    {t("cart")}
                  </span>
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
