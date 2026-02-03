// src/types/index.ts
export interface Product {
  id: number;
  name: LocalizedText;
  price: number;
  description?: LocalizedText;
  images: string[];
  stock: number;
  category?: LocalizedText;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: number;
  productId: string;
  quantity: number;
  sessionId: string;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
}

export interface OrderItemView {
  id: number;
  name: string;
  price: number;
  productId: number;
  quantity: number;
  image: string[];
  stock: number;
}

export interface Order {
  id: string;
  sessionId: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  discountAmount: number;
  carrier?: string;
  trackingNumber?: string;
  shipName: String;
  shipPhone: String;
  shipZip?: String;
  shipAddress1: String;
  shipAddress2?: String;
  shipMemo?: String;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
  stock: number;
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  PAID = "PAID",
  SHIPPING = "SHIPPING",
  CANCEL_REQUESTED = "CANCEL_REQUESTED",
  REFUNDED = "REFUNDED",
  RETURN_REQUESTED = "RETURN_REQUESTED",
  RETURNED = "RETURNED",
}

export interface SearchParams {
  search?: string;
  page?: number;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "name";
  category?: string;
}

export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  totalPages: number;
}
export interface LocalizedText {
  ko: string;
  en: string;
}

export type LangCode = "ko" | "en";

export type SNSType = "kakao" | "naver" | "google";

export interface Address {
  id: number;
  label: string;
  name: string;
  phone: string;
  address1: string;
  address2?: string;
  isDefault: boolean;
  zip?: string;
  memo?: string;
}

export interface Coupon {
  id: number;
  code: string;
  name: string;
  discountType: "PERCENT" | "AMOUNT";
  discountValue: number;
  minOrderAmount: number;
  isActive: boolean;
}

export interface Wishlist {
  id: number;
  productId: string;
  createdAt: string;

  product: {
    id: string;
    name: LocalizedText;
    price: number;
    images: string[];
    stock: number;
    category: string | null;
  };
}
