import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileTab() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">내정보</h1>

      <div className="max-w-xl">
        <div className="space-y-6">
          <div>
            <Label>이름</Label>
            <Input defaultValue="김로봇" className="mt-2" />
          </div>

          <div>
            <Label>이메일</Label>
            <Input defaultValue="robot@shop.com" type="email" className="mt-2" disabled />
            <p className="text-sm text-gray-500 mt-1">이메일은 변경할 수 없습니다</p>
          </div>

          <div>
            <Label>전화번호</Label>
            <Input defaultValue="010-1234-5678" className="mt-2" />
          </div>

          <div>
            <Label>생년월일</Label>
            <Input defaultValue="1990-01-01" type="date" className="mt-2" />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button className="flex-1">저장하기</Button>
            <Button variant="outline" className="flex-1">
              취소
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
