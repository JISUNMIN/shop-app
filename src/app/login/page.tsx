"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "next-auth/react";
import FullWidthSection from "@/components/layout/FullWidthSection";
import { SNSType } from "@/types";
import SNSButton from "@/components/common/SNSButton";
import FormInput from "@/components/common/FormInput";

type LoginForm = {
  email: string;
  password: string;
};

const schema = yup
  .object({
    email: yup
      .string()
      .email("이메일 형식이 올바르지 않습니다.")
      .required("이메일을 입력해주세요."),
    password: yup.string().required("비밀번호를 입력해주세요."),
  })
  .required();

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginForm) => {
    console.log(data);
    router.push("/");
  };

  const openSocialLoginPopup = async (provider: SNSType) => {
    const res = await signIn(provider, {
      callbackUrl: "/",
      redirect: false,
    });

    if (!res?.url) return;

    window.open(res.url, "snsLogin", "width=500,height=700");
  };

  return (
    <FullWidthSection>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Logo */}
            <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
              <Bot className="w-10 h-10" />
              <span className="text-2xl font-bold">RoboShop</span>
            </Link>

            {/* Login Card */}
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">로그인</CardTitle>
                <CardDescription className="text-center">
                  계정에 로그인하여 쇼핑을 시작하세요
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <FormInput
                  id="email"
                  type="email"
                  placeholder="robot@email.com"
                  registration={register("password")}
                  error={errors.password?.message}
                  label="이메일"
                />

                <FormInput
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  registration={register("password")}
                  error={errors.password?.message}
                  label="비밀번호"
                >
                  <Link href="/reset-password" className="text-sm text-blue-600 hover:underline">
                    비밀번호 찾기
                  </Link>
                </FormInput>

                <Button type="submit" className="w-full">
                  로그인
                </Button>

                {/* <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "로그인 중..." : "로그인"}
              </Button> */}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">또는 SNS로 로그인</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <SNSButton type="kakao" onClick={() => openSocialLoginPopup("kakao")} />
                  <SNSButton type="naver" onClick={() => openSocialLoginPopup("naver")} />
                </div>

                <div className="text-center text-sm">
                  <span className="text-gray-600">계정이 없으신가요? </span>
                  <Link href="/SignUp" className="text-blue-600 hover:underline font-medium">
                    회원가입
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </FullWidthSection>
  );
}
