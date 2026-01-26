export const coupons = [
  { id: 1, name: "신규가입 10% 할인", discount: "10%", expiry: "2026-02-28", minOrder: 100000 },
  { id: 2, name: "무료배송 쿠폰", discount: "배송비", expiry: "2026-01-31", minOrder: 0 },
  { id: 3, name: "50,000원 할인", discount: "50,000원", expiry: "2026-03-15", minOrder: 500000 },
  { id: 4, name: "시즌 특가 20% 할인", discount: "20%", expiry: "2026-02-15", minOrder: 200000 },
];

export const orders = [
  {
    id: "ORD-001",
    date: "2026-01-20",
    product: "Delivery Robot",
    amount: 1490000,
    status: "배송중",
  },
  {
    id: "ORD-002",
    date: "2026-01-15",
    product: "Smart Home Hub Robot",
    amount: 444500,
    status: "배송완료",
  },
  {
    id: "ORD-003",
    date: "2026-01-10",
    product: "Dancing Robot",
    amount: 599000,
    status: "배송완료",
  },
] as const;

export const wishlist = [
  {
    id: 1,
    name: "Warehouse Logistics Robot",
    price: 2390000,
    image: "https://images.unsplash.com/photo-1761195696590-3490ea770aa1?w=200",
  },
  {
    id: 2,
    name: "Medical Support Robot",
    price: 5690000,
    image: "https://images.unsplash.com/photo-1650171457588-dc7baef3ed22?w=200",
  },
];
