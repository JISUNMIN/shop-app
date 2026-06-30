"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "next-auth/react";
import SNSButton from "@/components/common/SNSButton";
import FormInput from "@/components/common/FormInput";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import RoboShopLogo from "@/components/common/RoboShopLogo";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ShieldCheck, UserRound } from "lucide-react";

type LoginForm = {
  userId: string;
  password: string;
};

type DemoRole = "customer" | "operator";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl");
  const callbackUrl = rawCallbackUrl && rawCallbackUrl.startsWith("/") ? rawCallbackUrl : null;
  const isOpsLogin = callbackUrl?.startsWith("/ops") ?? false;
  const [demoRole, setDemoRole] = useState<DemoRole>(isOpsLogin ? "operator" : "customer");
  const signupHref = callbackUrl
    ? `/signup?${new URLSearchParams({ callbackUrl }).toString()}`
    : "/signup";

  const schema = yup
    .object({
      userId: yup.string().required(t("auth.validation.userIdRequired")),
      password: yup.string().required(t("auth.validation.passwordRequired")),
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setDemoRole(isOpsLogin ? "operator" : "customer");
  }, [isOpsLogin]);

  useEffect(() => {
    const presets: Record<DemoRole, { userId: string; password: string }> = {
      customer: { userId: "demo_user", password: "demo1234!" },
      operator: { userId: "ops_admin", password: "admin1234!" },
    };

    const preset = presets[demoRole];
    setValue("userId", preset.userId, { shouldValidate: true });
    setValue("password", preset.password, { shouldValidate: true });
  }, [demoRole, setValue]);

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

    router.replace(callbackUrl ?? "/");
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="-mx-4 min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#eef5fb_48%,#ffffff_100%)] px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <section className="rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#143252_55%,#2f79c4_100%)] p-7 text-white shadow-[0_28px_70px_-36px_rgba(15,23,42,0.65)]">
            <RoboShopLogo
              className="flex items-center gap-2"
              botClassName="h-8 w-8"
              textClassName="text-2xl text-white"
            />
            <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9dd0ff]">
              Account Access
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em]">
              로그인 후
              <br />
              쇼핑과 운영 흐름을
              <br />
              바로 이어보세요
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/72">
              고객 주문 확인부터 운영 보드 시연까지, 이 프로젝트의 핵심 흐름을 같은 계정 진입
              경험 안에서 자연스럽게 이어갈 수 있게 정리했습니다.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/46">Demo</p>
                <p className="mt-2 text-lg font-semibold">고객 / 운영자 데모 계정</p>
                <p className="mt-2 text-sm leading-6 text-white/68">입력 없이 바로 흐름을 확인할 수 있도록 기본값을 채워둡니다.</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/46">Flow</p>
                <p className="mt-2 text-lg font-semibold">쇼핑과 운영 보드 연결</p>
                <p className="mt-2 text-sm leading-6 text-white/68">운영자 계정이면 주문 운영 보드까지 같은 데모 흐름 안에서 이어집니다.</p>
              </div>
            </div>
          </section>

          <div className="w-full max-w-md justify-self-center lg:max-w-lg">
            <Card className="rounded-[2rem] border-slate-200 bg-white/92 shadow-[0_22px_55px_-34px_rgba(15,23,42,0.18)] backdrop-blur">
              <CardHeader className="space-y-2">
                <CardTitle className="text-center text-2xl font-black tracking-[-0.03em]">
                  {t("auth.login")}
                </CardTitle>
                <CardDescription className="text-center text-sm leading-6">
                  {t("auth.loginDescription")}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {isOpsLogin && (
                  <div className="rounded-[1.5rem] border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                    <p className="font-semibold">{t("auth.opsNotice.title")}</p>
                    <p className="mt-2 leading-6">{t("auth.opsNotice.description")}</p>
                    <Link href="/ops-access" className="mt-3 inline-flex font-semibold underline underline-offset-4">
                      {t("auth.opsNotice.link")}
                    </Link>
                  </div>
                )}

                <div className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4">
                  <p className="text-sm font-semibold text-slate-950">{t("auth.demoLogin.title")}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{t("auth.demoLogin.description")}</p>

                  <RadioGroup
                    value={demoRole}
                    onValueChange={(value) => setDemoRole(value as DemoRole)}
                    className="mt-4 grid gap-3"
                  >
                    <Label
                      htmlFor="demo-customer"
                      className="flex cursor-pointer items-start gap-3 rounded-[1.25rem] border border-slate-200 bg-white p-4 transition-colors has-[[data-state=checked]]:border-[color:var(--button-bg)] has-[[data-state=checked]]:bg-[color-mix(in_oklch,var(--button-bg)_8%,white)]"
                    >
                      <RadioGroupItem value="customer" id="demo-customer" className="mt-0.5" />
                      <UserRound className="mt-0.5 h-4 w-4 text-slate-500" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-950">{t("auth.demoLogin.customer.label")}</p>
                        <p className="mt-1 text-sm text-slate-500">{t("auth.demoLogin.customer.description")}</p>
                        <p className="mt-2 text-xs text-slate-400">{t("auth.demoLogin.customer.credential")}</p>
                      </div>
                    </Label>

                    <Label
                      htmlFor="demo-operator"
                      className="flex cursor-pointer items-start gap-3 rounded-[1.25rem] border border-slate-200 bg-white p-4 transition-colors has-[[data-state=checked]]:border-[color:var(--button-bg)] has-[[data-state=checked]]:bg-[color-mix(in_oklch,var(--button-bg)_8%,white)]"
                    >
                      <RadioGroupItem value="operator" id="demo-operator" className="mt-0.5" />
                      <ShieldCheck className="mt-0.5 h-4 w-4 text-slate-500" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-950">{t("auth.demoLogin.operator.label")}</p>
                        <p className="mt-1 text-sm text-slate-500">{t("auth.demoLogin.operator.description")}</p>
                        <p className="mt-2 text-xs text-slate-400">{t("auth.demoLogin.operator.credential")}</p>
                      </div>
                    </Label>
                  </RadioGroup>
                </div>

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

                <Button type="submit" className="h-11 w-full rounded-full" disabled={isLoggingIn}>
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

                {/* <div className="grid grid-cols-3 gap-3"> */}
                <SNSButton type="kakao" hasLabel isLogin callbackUrl={callbackUrl ?? undefined} />
                {/* <SNSButton type="naver" /> */}
                {/* </div> */}

                <div className="text-center text-sm">
                  <span className="text-gray-600 mr-1">{t("auth.noAccount")}</span>
                  <Link href={signupHref} className="hover:underline font-medium">
                    <span className="text-[color:var(--link-accent)]">{t("auth.signup")}</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </form>
  );
}
