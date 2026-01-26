// components/common/SidebarContent.tsx
"use client";

import React from "react";
import { ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "./LogoutButton";

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
  label: string;
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
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="text-purple-600 border-purple-300">
            VIP 회원
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-300">
            누적 3회 구매
          </Badge>
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
                  activeTab === item.id
                    ? "bg-black text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            );
          })}
        </nav>
      </Card>

   <LogoutButton/>
    </>
  );
}
