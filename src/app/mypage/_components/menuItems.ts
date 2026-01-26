import { User, Lock, Gift, Package, Heart, MapPin, CreditCard } from "lucide-react";
import type { TabType } from "@/components/common/SidebarContent";

export const menuItems = [
  { id: "dashboard" as TabType, label: "대시보드", icon: User },
  { id: "orders" as TabType, label: "주문내역", icon: Package },
  { id: "coupons" as TabType, label: "할인쿠폰", icon: Gift },
  { id: "wishlist" as TabType, label: "찜한상품", icon: Heart },
  { id: "points" as TabType, label: "적립금", icon: CreditCard },
  { id: "address" as TabType, label: "배송지관리", icon: MapPin },
  { id: "profile" as TabType, label: "내정보", icon: User },
  { id: "password" as TabType, label: "비밀번호변경", icon: Lock },
] as const;
