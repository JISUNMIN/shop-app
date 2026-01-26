import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PasswordTab() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">비밀번호 변경</h1>
      <p className="text-gray-600 mb-6">보안을 위해 주기적으로 비밀번호를 변경해주세요</p>

      <div className="max-w-lg">
        <div className="space-y-6">
          <div>
            <Label>현재 비밀번호</Label>
            <Input type="password" className="mt-2" placeholder="현재 비밀번호를 입력하세요" />
            <p className="text-sm text-gray-500 mt-1">8자 이상, 영문/숫자/특수문자 조합</p>
          </div>

          <div>
            <Label>새 비밀번호 확인</Label>
            <Input type="password" className="mt-2" placeholder="새 비밀번호를 다시 입력하세요" />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button className="flex-1">
              <Lock className="w-4 h-4 mr-2" />
              비밀번호 변경
            </Button>
            <Button variant="outline" className="flex-1">
              취소
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
