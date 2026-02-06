"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "next-auth/react";
import FullWidthSection from "@/components/layout/FullWidthSection";
import SNSButton from "@/components/common/SNSButton";
import FormInput from "@/components/common/FormInput";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useState } from "react";
import RoboShopLogo from "@/components/common/RoboShopLogo";

type LoginForm = {
  userId: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const schema = yup
    .object({
      userId: yup.string().required(t("auth.validation.userIdRequired")),
      password: yup.string().required(t("auth.validation.passwordRequired")),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoggingIn(true);
    const res = await signIn("credentials", {
      userId: data.userId,
      password: data.password,
      redirect: false,
    });

    setIsLoggingIn(false);

    if (res?.error) {
      toast.error(t("auth.loginfail"));
      return;
    }

    router.push("/");
  };

  return (
    <FullWidthSection>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* 로고 */}

            <RoboShopLogo
              className="flex items-center justify-center gap-2 mb-8"
              botClassName="w-8 h-8"
              textClassName="text-2xl"
            />

            {/* 카드 영역 */}
            <Card className="border-gray-200 bg-white/80 backdrop-blur shadow-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">{t("auth.login")}</CardTitle>
                <CardDescription className="text-center">
                  {t("auth.loginDescription")}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <FormInput
                  id="userId"
                  placeholder="userId"
                  registration={register("userId")}
                  error={errors.userId?.message}
                  label={t("auth.userId")}
                />

                <FormInput
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  registration={register("password")}
                  error={errors.password?.message}
                  label={t("auth.password")}
                >
                  <Link
                    href="/forgot-password"
                    className="text-sm hover:underline text-[color:var(--link-accent)]"
                  >
                    {t("auth.forgotPassword")}
                  </Link>
                </FormInput>

                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? t("auth.loggingIn") : t("auth.login")}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">{t("auth.orSnsLogin")}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <SNSButton type="kakao" />
                  <SNSButton type="naver" />
                </div>

                <div className="text-center text-sm">
                  <span className="text-gray-600 mr-1">{t("auth.noAccount")}</span>
                  <Link href="/signup" className="hover:underline font-medium">
                    <span className="text-[color:var(--link-accent)]">{t("auth.signup")}</span>
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
