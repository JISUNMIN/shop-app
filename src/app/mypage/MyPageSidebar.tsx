"use client";

import { useRouter, useSearchParams } from "next/navigation";
import SidebarContent, { TabType } from "@/components/common/SidebarContent";
import { menuItems } from "./_components/menuItems";

export default function MyPageSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = (searchParams.get("tab") as TabType) || "dashboard";

  const handleSelectTab = (tab: TabType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/mypage?${params.toString()}`);
  };

  return (
    <SidebarContent
      menuItems={menuItems}
      activeTab={tabFromUrl}
      onSelectTab={handleSelectTab}
    />
  );
}
