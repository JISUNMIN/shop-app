"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FullWidthSection from "@/components/layout/FullWidthSection";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <FullWidthSection>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <Bot className="w-10 h-10" />
          <span className="text-2xl font-bold">RoboShop</span>
        </Link>

        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">비밀번호 재설정</CardTitle>
            <CardDescription className="text-center">
              {isSubmitted
                ? "비밀번호 재설정 링크를 발송했습니다. 이메일을 확인해 주세요."
                : "가입 시 사용한 이메일 주소를 입력해 주세요."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!isSubmitted ? (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    재설정 링크 보내기
                  </Button>
                </form>

                <div className="text-center text-sm space-y-2">
                  <div>
                    <span className="text-gray-600">비밀번호가 생각나셨나요? </span>
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                      로그인
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 text-center">
                    <strong>{email}</strong>로 비밀번호 재설정 링크를 발송했습니다.
                    <br />
                    이메일을 확인하고 링크를 클릭하여 비밀번호를 재설정하세요.
                  </p>
                </div>

                {/* 재발송 */}
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-gray-700">이메일이 보이지 않나요?</p>
                    <p className="text-xs text-gray-500">
                      스팸함을 확인하거나, 몇 분 후 다시 시도해 주세요.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      console.log("Resending email to:", email);
                      alert("비밀번호 재설정 링크를 다시 보내드렸습니다.");
                    }}
                  >
                    링크 다시 보내기
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                  >
                    다른 이메일로 다시 시도하기
                  </Button>
                </div>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    로그인 페이지로 돌아가기
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 도움말 */}
        {!isSubmitted && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 text-center">
              <strong>도움이 필요하신가요?</strong>
              <br />
              계정 복구에 문제가 있는 경우 고객센터(1234-5678)로 문의해주세요.
            </p>
          </div>
        )}
      </div>
    </FullWidthSection>
  );
}
