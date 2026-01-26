// components/common/SidebarContent.tsx
"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "./LogoutButton";
import { useTranslation } from "react-i18next";

export type TabType =
  | "dashboard"
  | "orders"
  | "coupons"
  | "wishlist"
  | "points"
  | "profile"
  | "password"
  | "address";

type MenuItem = {
  id: TabType;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
};

interface SidebarContentProps {
  menuItems: readonly MenuItem[];
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  setMobileMenuOpen?: (open: boolean) => void;
}

export default function SidebarContent({
  menuItems,
  activeTab,
  onSelectTab,
  setMobileMenuOpen,
}: SidebarContentProps) {
  const { t } = useTranslation();
  return (
    <>
      {/* 사용자 정보 */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            김
          </div>
          <div>
            <p className="font-bold text-lg">김로봇</p>
            <p className="text-sm text-gray-500">robot@shop.com</p>
          </div>
        </div>
      </Card>

      {/* 메뉴 */}
      <Card className="p-3">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen?.(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id ? "bg-black text-white" : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{t(item.labelKey)}</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            );
          })}
        </nav>
      </Card>

      <LogoutButton />
    </>
  );
}
