import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AddressTab() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">배송지관리</h1>

      <div className="space-y-4 mb-6">
        <Card className="p-4 md:p-6 border-2 border-blue-500 bg-blue-50">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
            <div>
              <Badge className="mb-2">기본 배송지</Badge>
              <p className="font-bold text-lg">집</p>
            </div>
            <Button variant="outline" size="sm">
              수정
            </Button>
          </div>
          <p className="text-gray-600 mb-1">김로봇 · 010-1234-5678</p>
          <p className="text-gray-600">서울시 강남구 테헤란로 123</p>
          <p className="text-gray-600">로봇빌딩 101호</p>
        </Card>

        <Card className="p-4 md:p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
            <div>
              <p className="font-bold text-lg">회사</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                기본 배송지 설정
              </Button>
              <Button variant="outline" size="sm">
                수정
              </Button>
            </div>
          </div>
          <p className="text-gray-600 mb-1">김로봇 · 010-1234-5678</p>
          <p className="text-gray-600">서울시 서초구 서초대로 100</p>
          <p className="text-gray-600">AI타워 5층</p>
        </Card>
      </div>

      <Button className="w-full" size="lg">
        <MapPin className="w-4 h-4 mr-2" />새 배송지 추가
      </Button>
    </div>
  );
}
