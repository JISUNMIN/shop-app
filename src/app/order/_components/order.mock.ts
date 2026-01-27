// app/order/_components/order.mock.ts

import type { Address, Coupon, OrderItem } from "@/app/order/_components/types";

export const initialAddresses: Address[] = [
  {
    id: 1,
    name: "집",
    recipient: "김로봇",
    phone: "010-1234-5678",
    address: "서울시 강남구 테헤란로 123",
    detailAddress: "로봇빌딩 101호",
    isDefault: true,
  },
  {
    id: 2,
    name: "회사",
    recipient: "김로봇",
    phone: "010-1234-5678",
    address: "서울시 서초구 서초대로 100",
    detailAddress: "AI타워 5층",
    isDefault: false,
  },
];

export const mockOrderItems: OrderItem[] = [
  {
    id: 1,
    name: "Delivery Robot",
    price: 1490000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1722452323413-b8f5447d4c41?w=200",
    stock: 10,
  },
  {
    id: 2,
    name: "Smart Home Hub Robot",
    price: 889000,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1762500824496-9094f37873c4?w=200",
    stock: 5,
  },
];

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