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
  id: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  paidAt?: string | null;
  deliveredAt?: string | null;
  refundedAt?: string | null;
  returnedAt?: string | null;
  cancelRequestedAt?: string | null;
  returnRequestedAt?: string | null;
  orderItems: OrderItem[];
  orderEvents?: OrderEvent[];
  discountAmount: number;
  carrier?: string;
  trackingNumber?: string;
  shipName: string;
  shipPhone: string;
  shipZip?: string;
  shipAddress1: string;
  shipAddress2?: string;
  shipMemo?: string;
  paymentMethod?: string;
}

export type UserRole = "USER" | "ADMIN";
export type OrderPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface OrderItem {
  id: number;
  orderId?: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCEL_REQUESTED = "CANCEL_REQUESTED",
  REFUNDED = "REFUNDED",
  RETURN_REQUESTED = "RETURN_REQUESTED",
  RETURNED = "RETURNED",
}

export type OrderActionType = "cancel" | "return";

export enum OrderEventType {
  ORDER_CREATED = "ORDER_CREATED",
  STATUS_CHANGED = "STATUS_CHANGED",
  CANCEL_REQUESTED = "CANCEL_REQUESTED",
  REFUNDED = "REFUNDED",
  RETURN_REQUESTED = "RETURN_REQUESTED",
  RETURNED = "RETURNED",
  PAYMENT_CONFIRMED = "PAYMENT_CONFIRMED",
  SHIPPING_STARTED = "SHIPPING_STARTED",
  DELIVERED = "DELIVERED",
}

export interface OrderEvent {
  id: number;
  orderId: number;
  eventType: OrderEventType;
  fromStatus?: OrderStatus | null;
  toStatus: OrderStatus;
  note?: string | null;
  createdAt: string;
}

export interface UpdateOrderShippingPayload {
  id: number;
  carrier?: string | null;
  trackingNumber?: string | null;
}

export interface OperatorOrderItem {
  id: number;
  orderId?: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: LocalizedText;
    price: number;
    images: string[];
    stock: number;
  };
}

export interface OperatorOrder {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  paymentMethod?: string | null;
  carrier?: string | null;
  trackingNumber?: string | null;
  assignedOperator?: string | null;
  priority: OrderPriority;
  slaDueAt?: string | null;
  internalMemo?: string | null;
  createdAt: string;
  paidAt?: string | null;
  deliveredAt?: string | null;
  cancelRequestedAt?: string | null;
  returnRequestedAt?: string | null;
  updatedAt?: string;
  shipName: string;
  shipPhone: string;
  orderItems: OperatorOrderItem[];
  orderEvents?: OrderEvent[];
  user: {
    id: string;
    name?: string | null;
    userId?: string | null;
    phone?: string | null;
    email?: string | null;
  };
}

export interface OperatorOrderDetail extends OperatorOrder {
  shipZip?: string | null;
  shipAddress1: string;
  shipAddress2?: string | null;
  shipMemo?: string | null;
  refundedAt?: string | null;
  returnedAt?: string | null;
  cancelReason?: string | null;
  cancelMemo?: string | null;
  returnReason?: string | null;
  returnMemo?: string | null;
}

export interface OperatorOrdersDashboard {
  summary: {
    totalOrders: number;
    paidOrders: number;
    shippingOrders: number;
    claimOrders: number;
    pendingOrders: number;
    todayOrders: number;
    delayedShippingOrders: number;
    urgentOrdersCount: number;
    overdueOrdersCount: number;
    unassignedOrdersCount: number;
  };
  statusCounts: Array<{
    status: OrderStatus;
    count: number;
  }>;
  orders: OperatorOrder[];
  generatedAt: string;
}

export interface SearchParams {
  search?: string;
  page?: number;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "name";
  category?: string;
  locale?: LangCode;
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
  coupon: Coupon;
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

export type FeatureItem = {
  icon?: "smartphone" | "mic" | "camera" | "speaker";
  title?: LocalizedText;
  desc?: LocalizedText;
};

export type DetailInfo = {
  maker?: string;
  origin?: LocalizedText;
  warranty?: LocalizedText;
  as?: LocalizedText;
  cert?: string;
};

export type GuideSection =
  | {
      type: "steps";
      title?: LocalizedText;
      items?: { title?: LocalizedText; desc?: LocalizedText }[];
    }
  | {
      type: "cards";
      title?: LocalizedText;
      items?: { cmd?: LocalizedText; desc?: LocalizedText }[];
    }
  | {
      type: "bullets";
      title?: LocalizedText;
      items?: LocalizedText[];
    }
  | {
      type: "text";
      title?: LocalizedText;
      body?: LocalizedText;
    };

export type Guide = { sections?: GuideSection[] };

export type Specs = {
  basic?: {
    size?: LocalizedText;
    weight?: LocalizedText;
    connect?: LocalizedText;
    camera?: LocalizedText;
    mic?: LocalizedText;
    speaker?: LocalizedText;
  };
  performance?: {
    cpu?: LocalizedText;
    ram?: LocalizedText;
    storage?: LocalizedText;
    battery?: LocalizedText;
    charge?: LocalizedText;
    os?: LocalizedText;
  };
  support?: { ko: string; en: string }[];
};

export interface ProductDetailsProps {
  detailData: Product;
  quantity: number;
  maxAvailable: number;
  getCartQuantity: () => number;
  isAddPending: boolean;
  onQuantityInput: (value: string) => void;
  onQuantityChange: (delta: number) => void;
  onAddToCart: () => void;
  productId: number;
}
