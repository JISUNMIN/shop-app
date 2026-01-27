// app/order/_components/order.types.ts
export interface Address {
  id: number;
  name: string;
  recipient: string;
  phone: string;
  address: string;
  detailAddress: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

export interface Coupon {
  id: number;
  name: string;
  discount: number | string;
  minOrder: number;
  type: "percent" | "fixed";
}

export type Agreements = {
  terms: boolean;
  privacy: boolean;
  payment: boolean;
};
