// app/order/_components/order.mock.ts

import type { Coupon } from "@/types";
export const mockCoupons: Coupon[] = [
  { id: 1, name: "신규가입 10% 할인", discount: 10, minOrder: 100000, type: "percent" },
  { id: 2, name: "50,000원 할인", discount: 50000, minOrder: 500000, type: "fixed" },
  { id: 3, name: "시즌 특가 20% 할인", discount: 20, minOrder: 200000, type: "percent" },
  { id: 4, name: "무료배송 쿠폰", discount: 3000, minOrder: 0, type: "fixed" },
];

export const ORDER_AVAILABLE_POINTS = 124500;
export const ORDER_DELIVERY_FEE = 3000;
export const ORDER_FREE_SHIPPING_THRESHOLD = 50000;

export const ORDER_DELIVERY_MEMOS = [
  "직접 입력",
  "문 앞에 놓아주세요",
  "경비실에 맡겨주세요",
  "택배함에 넣어주세요",
  "배송 전 연락주세요",
  "부재 시 연락주세요",
] as const;
