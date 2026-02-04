"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Card } from "@/components/ui/card";
import { TabType } from "@/components/common/SidebarContent";

import DashboardTab from "@/app/mypage/tabs/DashboardTab";
import OrdersTab from "@/app/mypage/tabs/OrdersTab";
import CouponsTab from "@/app/mypage/tabs/CouponsTab";
import WishlistTab from "@/app/mypage/tabs/WishlistTab";
// import PointsTab from "@/app/mypage/tabs/PointsTab";
import AddressTab from "@/app/mypage/tabs/AddressTab";
import ProfileTab from "@/app/mypage/tabs/ProfileTab";

export default function MyPageShell() {
  const searchParams = useSearchParams();

  const tabFromUrl = (searchParams.get("tab") as TabType) || "dashboard";
  const [activeTab, setActiveTab] = useState<TabType>(tabFromUrl);

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  return (
    <div className="flex-1 min-w-0">
      <Card className="p-4 md:p-8">
        {activeTab === "dashboard" && <DashboardTab />}

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
