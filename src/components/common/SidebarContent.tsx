// components/common/SidebarContent.tsx
"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LogoutButton } from "./LogoutButton";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import { getAvatarText } from "@/utils/helper";

export type TabType =
  | "dashboard"
  | "orders"
  | "coupons"
  | "wishlist"
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
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <>
      {/* 사용자 정보 */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklch, var(--button-bg) 85%, #111), color-mix(in oklch, var(--button-bg) 55%, transparent))",
            }}
          >
            {getAvatarText(user?.name)}
          </div>
          <div>
            <p className="font-bold text-lg">
              {user?.name ?? `${user?.provider} ${t("mypage.user")}`}
            </p>
            <p className="text-sm text-gray-500">{user?.email ?? ""}</p>
          </div>
        </div>
      </Card>

      {/* 메뉴 */}
      <Card className="p-3">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen?.(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-white text-gray-900"
                      : "hover:bg-gray-100 text-gray-700"
                  }
                `}
                style={
                  isActive
                    ? ({
                        boxShadow:
                          "0 0 0 2px color-mix(in oklch, var(--button-bg) 30%, transparent) inset",
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-gray-900" : "text-gray-600"
                  }`}
                />
                <span className="font-medium">{t(item.labelKey)}</span>
                <ChevronRight
                  className={`w-4 h-4 ml-auto ${
                    isActive ? "text-gray-700" : "text-gray-400"
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </Card>

      <LogoutButton />
    </>
  );
}
