// src/types/index.ts
export interface Product {
  id: string;
  name: LocalizedText;
  price: number;
  description?: string;
  images: string[];
  stock: number;
  category?: LocalizedText;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  sessionId: string;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
}

export interface Order {
  id: string;
  sessionId: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
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
