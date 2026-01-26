import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Order = {
  id: string;
  date: string;
  product: string;
  amount: number;
  status: string;
};

export default function OrdersTab({ orders }: { orders: Order[] }) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">주문내역</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-4 md:p-6 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">{order.date}</p>
                <p className="text-base md:text-lg font-bold">{order.product}</p>
                <p className="text-sm text-gray-600 mt-1">주문번호: {order.id}</p>
              </div>
              <Badge className={order.status === "배송완료" ? "bg-green-500" : "bg-blue-500"}>
                {order.status}
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t gap-3">
              <p className="text-xl md:text-2xl font-bold">{order.amount.toLocaleString()}원</p>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  상세보기
                </Button>
                {order.status === "배송완료" && (
                  <Button size="sm" className="flex-1 sm:flex-none">
                    리뷰작성
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
