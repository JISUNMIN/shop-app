import { Card } from "@/components/ui/card";

export default function PointsTab() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">적립금</h1>

      <Card className="p-6 md:p-8 mb-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
        <p className="text-base md:text-lg mb-2 opacity-90">사용 가능한 적립금</p>
        <p className="text-3xl md:text-5xl font-bold">124,500원</p>
      </Card>

      <h2 className="text-lg md:text-xl font-bold mb-4">적립금 내역</h2>
      <div className="space-y-3">
        <Card className="p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">구매 적립</p>
              <p className="text-sm text-gray-500">2026-01-15 · ORD-002</p>
            </div>
            <p className="text-lg font-bold text-green-600">+22,225원</p>
          </div>
        </Card>

        <Card className="p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">리뷰 작성 적립</p>
              <p className="text-sm text-gray-500">2026-01-12</p>
            </div>
            <p className="text-lg font-bold text-green-600">+2,000원</p>
          </div>
        </Card>

        <Card className="p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">회원가입 적립</p>
              <p className="text-sm text-gray-500">2026-01-05</p>
            </div>
            <p className="text-lg font-bold text-green-600">+100,000원</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
