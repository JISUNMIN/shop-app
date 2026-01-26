import { User, Lock, Gift, Package, Heart, MapPin, CreditCard } from "lucide-react";
import type { TabType } from "@/components/common/SidebarContent";

export const menuItems = [
  { id: "dashboard" as TabType, labelKey: "mypage.tabs.dashboard", icon: User },
  { id: "orders" as TabType, labelKey: "mypage.tabs.orders", icon: Package },
  { id: "coupons" as TabType, labelKey: "mypage.tabs.coupons", icon: Gift },
  { id: "wishlist" as TabType, labelKey: "mypage.tabs.wishlist", icon: Heart },
  { id: "points" as TabType, labelKey: "mypage.tabs.points", icon: CreditCard },
  { id: "address" as TabType, labelKey: "mypage.tabs.address", icon: MapPin },
  { id: "profile" as TabType, labelKey: "mypage.tabs.profile", icon: User },
  { id: "password" as TabType, labelKey: "mypage.tabs.password", icon: Lock },
] as const;
