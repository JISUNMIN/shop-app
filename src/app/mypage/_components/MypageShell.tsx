"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card } from "@/components/ui/card";
import SidebarContent, { TabType } from "@/components/common/SidebarContent";

import DashboardTab from "@/app/mypage/tabs/DashboardTab";
import OrdersTab from "@/app/mypage/tabs/OrdersTab";
import CouponsTab from "@/app/mypage/tabs/CouponsTab";
import WishlistTab from "@/app/mypage/tabs/WishlistTab";
// import PointsTab from "@/app/mypage/tabs/PointsTab";
import AddressTab from "@/app/mypage/tabs/AddressTab";
import ProfileTab from "@/app/mypage/tabs/ProfileTab";

import { coupons, orders } from "./mockData";

export default function MyPageShell() {
  const searchParams = useSearchParams();

  const tabFromUrl = (searchParams.get("tab") as TabType) || "dashboard";
  const [activeTab, setActiveTab] = useState<TabType>(tabFromUrl);

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  return (
    <div className="flex-1 min-w-0">
      {/* 콘텐츠 */}
      <Card className="p-4 md:p-8">
        {activeTab === "dashboard" && (
          <DashboardTab
            orders={[...orders] as any}
            couponCount={coupons.length}
            pointsLabel="124,500원"
          />
        )}

        {activeTab === "orders" && <OrdersTab />}

        {activeTab === "coupons" && <CouponsTab />}

        {activeTab === "wishlist" && <WishlistTab />}

        {/* {activeTab === "points" && <PointsTab />} */}

        {activeTab === "address" && <AddressTab />}

        {activeTab === "profile" && <ProfileTab />}
      </Card>
    </div>
  );
}
