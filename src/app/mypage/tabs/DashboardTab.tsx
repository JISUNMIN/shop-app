import { Package, Gift, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Order = {
  id: string;
  date: string;
  product: string;
  amount: number;
  status: string;
};

export default function DashboardTab({
  orders,
  couponCount,
  pointsLabel = "124,500원",
}: {
  orders: Order[];
  couponCount: number;
  pointsLabel?: string;
}) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">대시보드</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <Package className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90">주문내역</p>
          <p className="text-3xl font-bold mt-1">{orders.length}건</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <Gift className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90">사용 가능 쿠폰</p>
          <p className="text-3xl font-bold mt-1">{couponCount}장</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CreditCard className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90">적립금</p>
          <p className="text-3xl font-bold mt-1">{pointsLabel}</p>
        </Card>
      </div>

      <h2 className="text-lg md:text-xl font-bold mb-4">최근 주문</h2>
      <div className="space-y-3">
        {orders.slice(0, 2).map((order) => (
          <Card key={order.id} className="p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{order.product}</p>
                <p className="text-sm text-gray-500">
                  {order.date} · {order.id}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{order.amount.toLocaleString()}원</p>
                <Badge className={order.status === "배송완료" ? "bg-green-500" : "bg-blue-500"}>
                  {order.status}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
