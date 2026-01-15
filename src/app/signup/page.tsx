"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import FullWidthSection from "@/components/layout/FullWidthSection";
import SNSButton from "@/components/common/SNSButton";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "@/components/common/FormInput";

type SignupForm = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

const schema = yup.object({
  name: yup.string().max(4, "이름은 4글자 이상 입력할수 없습니다.").required(),
  email: yup.string().email("이메일 형식이 올바르지 않습니다.").required("이메일을 입력해주세요."),
  password: yup.string().required("비밀번호를 입력해주세요."),
  passwordConfirm: yup
    .string()
    .required("비밀번호를 입력해주세요.")
    .oneOf([yup.ref("password"), "비밀번호가 일치하지 않습니다."]),
});

export default function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   password: "",
  //   confirmPassword: "",
  //   agreeTerms: false,
  //   agreePrivacy: false,
  //   agreeMarketing: false,
  // });

  const onSubmit = (data: SignupForm) => {
    console.log(data);

    // if (formData.password !== formData.confirmPassword) {
    //   alert("비밀번호가 일치하지 않습니다.");
    //   return;
    // }

    // if (!formData.agreeTerms || !formData.agreePrivacy) {
    //   alert("필수 약관에 동의해주세요.");
    //   return;
    // }
    router.push("/login");
  };

  const handleSNSSignup = (provider: string) => {
    console.log(`${provider} 회원가입 시도`);
    router.push("/");
  };

  return (
    <FullWidthSection>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <Bot className="w-10 h-10" />
          <span className="text-2xl font-bold">RoboShop</span>
        </Link>

        {/* Signup Card */}
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">회원가입</CardTitle>
            <CardDescription className="text-center">
              새로운 계정을 만들어 쇼핑을 시작하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* SNS Signup */}
            <div className="space-y-3">
              <SNSButton
                className="h-12 gap-3"
                hasLabel
                type="kakao"
                onClick={() => handleSNSSignup("kakao")}
              />

              <SNSButton
                className="h-12 gap-3"
                hasLabel
                type="naver"
                onClick={() => handleSNSSignup("naver")}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">또는 이메일로 가입</span>
              </div>
            </div>

            {/* Email Signup Form */}
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <FormInput
                  id="name"
                  placeholder="김로봇"
                  registration={register("name")}
                  error={errors.name?.message}
                  label="이름"
                />
              </div>
              <div className="space-y-2">
                <FormInput
                  id="email"
                  type="email"
                  placeholder="robot@email.com"
                  registration={register("email")}
                  error={errors.email?.message}
                  label="이메일"
                />
              </div>

              <div className="space-y-2">
                <FormInput
                  id="password"
                  type="password"
                  placeholder="8자 이상 입력해주세요"
                  minLength={8}
                  registration={register("email")}
                  error={errors.password?.message}
                  label="비밀번호"
                />
              </div>

              <div className="space-y-2">
                <FormInput
                  id="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력해주세요"
                  minLength={8}
                  registration={register("passwordConfirm")}
                  error={errors.passwordConfirm?.message}
                  label="비밀번호 확인"
                />
              </div>

              {/* <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          agreeTerms: checked as boolean,
                        })
                      }
                    />
                    <label
                      htmlFor="agreeTerms"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <span className="text-red-500">*</span> 이용약관에 동의합니다
                    </label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreePrivacy"
                      checked={formData.agreePrivacy}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          agreePrivacy: checked as boolean,
                        })
                      }
                    />
                    <label
                      htmlFor="agreePrivacy"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <span className="text-red-500">*</span> 개인정보 수집 및 이용에 동의합니다
                    </label>
                  </div>
                </div> */}

              <Button type="submit" className="w-full h-11">
                회원가입
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-gray-600">이미 계정이 있으신가요? </span>
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                로그인
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </FullWidthSection>
  );
}
