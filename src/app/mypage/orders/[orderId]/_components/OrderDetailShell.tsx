"use client";

import {
  ChevronLeft,
  Truck,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface OrderItem {
  id: string;
  name: string;
  option: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderDetailData {
  id: string;
  date: string;
  status: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    detailAddress: string;
    zipCode: string;
    request: string;
  };
  payment: {
    method: string;
    productPrice: number;
    shippingFee: number;
    discount: number;
    totalPrice: number;
  };
  tracking: {
    carrier: string;
    trackingNumber: string;
    status: string;
  };
}

// Mock data
const orderDetails: Record<string, OrderDetailData> = {
  "1": {
    id: "1",
    date: "2026. 02. 02. 14:30",
    status: "배송완료",
    orderNumber: "ORD-2026-02-02-001",
    items: [
      {
        id: "1",
        name: "스마트폰 허브로봇 봉이",
        option: "컬러: 화이트 / 용량: 128GB",
        quantity: 1,
        price: 889000,
        image: "robot assistant white",
      },
    ],
    shippingAddress: {
      name: "홍길동",
      phone: "010-1234-5678",
      address: "서울특별시 강남구 테헤란로 123",
      detailAddress: "456호",
      zipCode: "06234",
      request: "문 앞에 놓아주세요",
    },
    payment: {
      method: "신용카드",
      productPrice: 889000,
      shippingFee: 0,
      discount: 0,
      totalPrice: 889000,
    },
    tracking: {
      carrier: "로보배송",
      trackingNumber: "1234567890123",
      status: "배송완료",
    },
  },
  "2": {
    id: "2",
    date: "2026. 02. 02. 12:15",
    status: "배송완료",
    orderNumber: "ORD-2026-02-02-002",
    items: [
      {
        id: "2",
        name: "스마트폰 허브로봇 봉이",
        option: "컬러: 블랙 / 용량: 256GB",
        quantity: 1,
        price: 889000,
        image: "robot assistant black",
      },
    ],
    shippingAddress: {
      name: "홍길동",
      phone: "010-1234-5678",
      address: "서울특별시 강남구 테헤란로 123",
      detailAddress: "456호",
      zipCode: "06234",
      request: "부재시 경비실에 맡겨주세요",
    },
    payment: {
      method: "신용카드",
      productPrice: 889000,
      shippingFee: 0,
      discount: 0,
      totalPrice: 889000,
    },
    tracking: {
      carrier: "로보배송",
      trackingNumber: "1234567890124",
      status: "배송완료",
    },
  },
  "3": {
    id: "3",
    date: "2026. 02. 02. 10:30",
    status: "배송완료",
    orderNumber: "ORD-2026-02-02-003",
    items: [
      {
        id: "3",
        name: "스마트폰 허브로봇 봉이",
        option: "컬러: 실버 / 용량: 128GB",
        quantity: 1,
        price: 889000,
        image: "robot assistant silver",
      },
    ],
    shippingAddress: {
      name: "홍길동",
      phone: "010-1234-5678",
      address: "서울특별시 강남구 테헤란로 123",
      detailAddress: "456호",
      zipCode: "06234",
      request: "배송 전 연락주세요",
    },
    payment: {
      method: "카카오페이",
      productPrice: 889000,
      shippingFee: 0,
      discount: 0,
      totalPrice: 889000,
    },
    tracking: {
      carrier: "로보배송",
      trackingNumber: "1234567890125",
      status: "배송완료",
    },
  },
  "4": {
    id: "4",
    date: "2026. 02. 02. 09:45",
    status: "배송완료",
    orderNumber: "ORD-2026-02-02-004",
    items: [
      {
        id: "4",
        name: "스마트폰 허브로봇 봉이",
        option: "컬러: 골드 / 용량: 256GB",
        quantity: 1,
        price: 889000,
        image: "robot assistant gold",
      },
    ],
    shippingAddress: {
      name: "홍길동",
      phone: "010-1234-5678",
      address: "서울특별시 강남구 테헤란로 123",
      detailAddress: "456호",
      zipCode: "06234",
      request: "직접 수령하겠습니다",
    },
    payment: {
      method: "네이버페이",
      productPrice: 889000,
      shippingFee: 0,
      discount: 0,
      totalPrice: 889000,
    },
    tracking: {
      carrier: "로보배송",
      trackingNumber: "1234567890126",
      status: "배송완료",
    },
  },
  "5": {
    id: "5",
    date: "2026. 02. 02. 08:20",
    status: "배송완료",
    orderNumber: "ORD-2026-02-02-005",
    items: [
      {
        id: "5-1",
        name: "배달로봇 멀티비타민",
        option: "용량: 60정",
        quantity: 2,
        price: 89000,
        image: "delivery robot vitamin",
      },
      {
        id: "5-2",
        name: "스마트폰 허브로봇 봉이",
        option: "컬러: 화이트 / 용량: 128GB",
        quantity: 2,
        price: 889000,
        image: "robot assistant white",
      },
      {
        id: "5-3",
        name: "청소로봇 프리미엄",
        option: "컬러: 블랙",
        quantity: 1,
        price: 523000,
        image: "cleaning robot black",
      },
    ],
    shippingAddress: {
      name: "홍길동",
      phone: "010-1234-5678",
      address: "서울특별시 강남구 테헤란로 123",
      detailAddress: "456호",
      zipCode: "06234",
      request: "문 앞에 놓아주세요",
    },
    payment: {
      method: "신용카드",
      productPrice: 2379000,
      shippingFee: 0,
      discount: 0,
      totalPrice: 2379000,
    },
    tracking: {
      carrier: "로보배송",
      trackingNumber: "1234567890127",
      status: "배송완료",
    },
  },
};

export default function OrderDetailShell() {
  const router = useRouter();
  const { orderId } = useParams<{ orderId: string }>();

  const order = orderId ? orderDetails[orderId] : null;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">주문을 찾을 수 없습니다</h2>
          <button
            onClick={() => router.push("/mypage?tab=orders")}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            주문내역으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-[1400px] mx-auto flex gap-6 p-6">

        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* Back Button */}
            <button
              onClick={() => router.push("/mypage?tab=orders")}
              className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>주문내역으로 돌아가기</span>
            </button>

            {/* Order Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">주문 상세보기</h1>
                <span className="px-4 py-2 bg-green-500 text-white rounded-lg">{order.status}</span>
              </div>
              <div className="flex gap-6 text-sm text-gray-600">
                <span>주문번호: {order.orderNumber}</span>
                <span>주문일시: {order.date}</span>
              </div>
            </div>

            {/* Delivery Tracking */}
            <div className="mb-8 p-6 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-6 h-6 text-blue-600" />
                <h2 className="font-semibold">배송 정보</h2>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">배송업체</p>
                  <p className="font-medium">{order.tracking.carrier}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">운송장번호</p>
                  <p className="font-medium">{order.tracking.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">배송상태</p>
                  <p className="font-medium text-green-600">{order.tracking.status}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h2 className="font-semibold mb-4">주문 상품</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={`https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.option}</p>
                      <p className="text-sm text-gray-600">수량: {item.quantity}개</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {(item.price * item.quantity).toLocaleString()}원
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-8">
              <h2 className="font-semibold mb-4">배송지 정보</h2>
              <div className="p-6 border border-gray-200 rounded-lg space-y-3">
                <div className="flex">
                  <span className="w-24 text-gray-600">받는사람</span>
                  <span>{order.shippingAddress.name}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-600">연락처</span>
                  <span>{order.shippingAddress.phone}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-600">주소</span>
                  <div>
                    <p>[{order.shippingAddress.zipCode}]</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.detailAddress}</p>
                  </div>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-600">배송요청</span>
                  <span>{order.shippingAddress.request}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-8">
              <h2 className="font-semibold mb-4">결제 정보</h2>
              <div className="p-6 border border-gray-200 rounded-lg">
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">상품금액</span>
                    <span>{order.payment.productPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">배송비</span>
                    <span>{order.payment.shippingFee.toLocaleString()}원</span>
                  </div>
                  {order.payment.discount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>할인금액</span>
                      <span>-{order.payment.discount.toLocaleString()}원</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">총 결제금액</span>
                  <span className="text-2xl font-semibold">
                    {order.payment.totalPrice.toLocaleString()}원
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">결제수단</span>
                    <span>{order.payment.method}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                재주문하기
              </button>
              <button className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                배송조회
              </button>
              <button className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                교환/반품 신청
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
