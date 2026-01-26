import { Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Coupon = {
  id: number;
  name: string;
  discount: string;
  expiry: string;
  minOrder: number;
};

export default function CouponsTab({ coupons }: { coupons: Coupon[] }) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">할인쿠폰</h1>
      <p className="text-gray-600 mb-6">사용 가능한 쿠폰 {coupons.length}장</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full -mr-12 -mt-12 opacity-20" />
            <div className="p-6 relative">
              <div className="flex items-start justify-between mb-3">
                <Gift className="w-8 h-8 text-orange-500" />
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  {coupon.discount}
                </Badge>
              </div>
              <h3 className="font-bold text-lg mb-2">{coupon.name}</h3>
              <p className="text-sm text-gray-600 mb-1">
                {coupon.minOrder > 0
                  ? `${coupon.minOrder.toLocaleString()}원 이상 구매 시`
                  : "제한없음"}
              </p>
              <p className="text-xs text-gray-500">~ {coupon.expiry}까지</p>
              <Button className="w-full mt-4" size="sm">
                사용하기
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-4 md:p-6 bg-gray-50 border-dashed">
        <p className="text-center text-gray-600 mb-3">쿠폰 코드를 입력하세요</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input placeholder="쿠폰 코드 입력" className="flex-1" />
          <Button className="w-full sm:w-auto">등록</Button>
        </div>
      </Card>
    </div>
  );
}
