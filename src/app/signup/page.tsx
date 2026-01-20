"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Controller, useForm } from "react-hook-form";
import FullWidthSection from "@/components/layout/FullWidthSection";
import SNSButton from "@/components/common/SNSButton";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "@/components/common/FormInput";

import useSignup from "@/hooks/useSignup";
import { useEffect, useState } from "react";
import usePhoneVerification from "@/hooks/usePhoneVerification";
import { getApiMessage } from "@/lib/otp";
import { useTranslation } from "react-i18next";

type SignupForm = {
  userId: string;
  password: string;
  passwordConfirm: string;
  mobileNumber: string;
  mobileCode: string;
  name: string;
  email?: string | undefined;
  agreeTerms: boolean;
  agreePrivacy: boolean;
};

export default function SignupPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { signupMutate, isSignupPending } = useSignup();
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [resendCooldownSec, setResendCooldownSec] = useState(0);
  const [otpExpiresSec, setOtpExpiresSec] = useState(0);

  const formattedTime = `${Math.floor(otpExpiresSec / 60)
    .toString()
    .padStart(2, "0")}:${(otpExpiresSec % 60).toString().padStart(2, "0")}`;

  const getSendCodeButtonText = () => {
    if (mobileVerified) return t("auth.sendCode");

    if (resendCooldownSec > 0) {
      return t("auth.resendInSeconds", { seconds: resendCooldownSec });
    }
    if (isSendingCode) return t("auth.sending");

    return t("auth.sendCode");
  };

  const {
    sendPhoneCodeMutate,
    isSendPhoneCodePending,
    verifyPhoneCodeMutate,
    isVerifyPhoneCodePending,
  } = usePhoneVerification();

  const schema = yup
    .object({
      userId: yup
        .string()
        .required(t("auth.validation.userIdRequired"))
        .matches(/^[a-zA-Z0-9]+$/, t("auth.validation.userIdInvalid"))
        .min(4, t("auth.validation.minLength4"))
        .max(16, t("auth.validation.maxLength16")),
      password: yup
        .string()
        .required(t("auth.validation.passwordRequired"))
        .min(8, t("auth.passwordPlaceholder")),

      passwordConfirm: yup
        .string()
        .required(t("auth.validation.passwordConfirmRequired"))
        .min(8, t("auth.passwordPlaceholder"))
        .oneOf([yup.ref("password")], t("auth.validation.passwordMismatch")),

      mobileNumber: yup
        .string()
        .required(t("auth.validation.mobileNumberRequired"))
        .transform((value) => (value ? value.replace(/-/g, "").trim() : value))
        .matches(/^\d{11}$/, t("auth.validation.mobileNumberInvalid")),

      mobileCode: yup
        .string()
        .required(t("auth.validation.mobileCodeRequired"))
        .transform((value) => (value ? value.trim() : value))
        .matches(/^\d{4,6}$/, t("auth.validation.mobileCodeInvalid")),

      name: yup
        .string()
        .required(t("auth.validation.nameRequired"))
        .max(4, t("auth.validation.nameMaxLength")),

      email: yup
        .string()
        .transform((v) => (v?.trim() === "" ? undefined : v?.trim()))
        .optional()
        .email(t("auth.validation.emailInvalid")),

      agreeTerms: yup
        .boolean()
        .oneOf([true], t("auth.validation.agreeTermsRequired"))
        .required(t("auth.validation.agreeTermsRequired")),

      agreePrivacy: yup
        .boolean()
        .oneOf([true], t("auth.validation.agreePrivacyRequired"))
        .required(t("auth.validation.agreePrivacyRequired")),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,

    getValues,
    setValue,
    setError,
    clearErrors,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      agreeTerms: false,
      agreePrivacy: false,
    },
  });

  const onSubmit = async (data: SignupForm) => {
    console.log(data);
    try {
      const { userId, password, name, mobileNumber, email } = data;
      await signupMutate({ userId, password, name, mobileNumber, email });
      router.push("/login");
    } catch {}
  };

  const handleSNSSignup = (provider: string) => {
    console.log(`${provider} 회원가입 시도`);
    router.push("/");
  };

  // 코드 전송
  const handleSendCode = async () => {
    const isValid = await trigger("mobileNumber");
    if (!isValid) return;
    const mobileNumber = getValues("mobileNumber")?.trim();
    setIsSendingCode(true);

    try {
      const res = await sendPhoneCodeMutate({ phone: mobileNumber });
      const { code } = res;

      if (!res?.ok) {
        throw new Error(res?.message ?? t("auth.validation.mobileNumberInvalid"));
      }

      setCodeSent(true);
      setValue("mobileCode", code!!);
      setOtpExpiresSec(res.expiresInSec ?? 0);
    } catch (e: any) {
      const msg = getApiMessage(e, t, t("auth.validation.mobileNumberInvalid"));

      setError("mobileNumber", {
        type: "manual",
        message: msg,
      });

      if (e?.response?.status === 429) {
        const sec = e?.response?.data?.retryAfterSec;
        if (typeof sec === "number") setResendCooldownSec(sec);
      }
    } finally {
      clearErrors("mobileCode");
      setIsSendingCode(false);
    }
  };

  // 코드 확인
  const handleVerifyCode = async () => {
    const mobileNumber = getValues("mobileNumber")?.trim();
    const mobileCode = getValues("mobileCode")?.trim();

    if (!codeSent) {
      setError("mobileCode", {
        type: "manual",
        message: t("auth.validation.sendCodeFirst"),
      });
      return;
    }

    if (!mobileCode) {
      setError("mobileCode", {
        type: "manual",
        message: t("auth.validation.mobileCodeRequired"),
      });
      return;
    }

    if (!/^\d{4,6}$/.test(mobileCode)) {
      setError("mobileCode", {
        type: "manual",
        message: t("auth.validation.mobileCodeInvalid"),
      });
      return;
    }

    clearErrors("mobileCode");
    setIsVerifyingCode(true);

    try {
      const res = await verifyPhoneCodeMutate({
        phone: mobileNumber,
        code: mobileCode,
      });

      if (!res?.ok) {
        throw new Error(res?.message ?? t("auth.validation.mobileCodeInvalid"));
      }

      setMobileVerified(true);
    } catch (e: any) {
      setMobileVerified(false);
      const msg = getApiMessage(e, t, t("auth.validation.mobileCodeInvalid"));

      setError("mobileCode", {
        type: "manual",
        message: msg,
      });
    } finally {
      clearErrors("mobileNumber");
      setIsVerifyingCode(false);
    }
  };

  useEffect(() => {
    if (resendCooldownSec <= 0 || mobileVerified) return;
    const t = setInterval(() => setResendCooldownSec((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [resendCooldownSec]);

  useEffect(() => {
    if (otpExpiresSec <= 0 || mobileVerified) return;
    const t = setInterval(() => setOtpExpiresSec((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [otpExpiresSec]);

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
            <CardTitle className="text-2xl text-center">{t("auth.signupTitle")}</CardTitle>
            <CardDescription className="text-center">{t("auth.signupDescription")}</CardDescription>
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
                <span className="bg-white px-2 text-gray-500">{t("auth.orEmailSignup")}</span>
              </div>
            </div>

            {/* 일반 회원가입*/}
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <FormInput
                  id="userId"
                  placeholder={t("auth.placeholders.userIdPlaceholder")}
                  registration={register("userId")}
                  error={errors.userId?.message}
                  label={t("auth.userId")}
                />
              </div>

              <div className="space-y-2">
                <FormInput
                  id="password"
                  type="password"
                  placeholder={t("auth.passwordPlaceholder")}
                  registration={register("password")}
                  error={errors.password?.message}
                  label={t("auth.password")}
                />
              </div>

              <div className="space-y-2">
                <FormInput
                  id="confirmPassword"
                  type="password"
                  placeholder={t("auth.confirmPasswordPlaceholder")}
                  registration={register("passwordConfirm")}
                  error={errors.passwordConfirm?.message}
                  label={t("auth.confirmPassword")}
                />
              </div>
              {/* 이름*/}
              <div className="space-y-2">
                <FormInput
                  id="name"
                  placeholder={t("auth.placeholders.nameExample")}
                  registration={register("name")}
                  error={errors.name?.message}
                  label={t("auth.name")}
                />
              </div>

              {/* 핸드폰 번호*/}
              <div className="space-y-2">
                <FormInput
                  id="mobileNumber"
                  placeholder={t("auth.placeholders.mobileNumberExample")}
                  registration={register("mobileNumber", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    },
                  })}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  minLength={11}
                  error={errors.mobileNumber?.message}
                  label={t("auth.mobileNumber")}
                  disabled={mobileVerified}
                  rightElement={
                    <Button
                      type="button"
                      className="h-10 px-3 whitespace-nowrap"
                      onClick={handleSendCode}
                      disabled={isSendingCode || resendCooldownSec > 0 || mobileVerified}
                    >
                      {getSendCodeButtonText()}
                    </Button>
                  }
                />
              </div>
              {/* 핸드폰 인증*/}
              <div className="space-y-2">
                <FormInput
                  id="mobileCode"
                  label={t("auth.mobileVerification")}
                  placeholder={t("auth.placeholders.mobileCodeExample")}
                  registration={register("mobileCode", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    },
                  })}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  error={errors.mobileCode?.message}
                  disabled={mobileVerified}
                  rightElement={
                    <Button
                      type="button"
                      className="h-10 px-3 whitespace-nowrap"
                      onClick={handleVerifyCode}
                      disabled={mobileVerified}
                    >
                      {isVerifyingCode ? t("auth.verifying") : t("auth.verify")}
                    </Button>
                  }
                />
                {/* 남은 시간(타이머) */}
                {codeSent && !mobileVerified && (
                  <div
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                      otpExpiresSec > 0 ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold">
                      {otpExpiresSec > 0
                        ? t("auth.otpRemainingTime", { time: formattedTime })
                        : t("auth.otpExpired")}
                    </span>
                  </div>
                )}
              </div>

              {/* 이메일 */}
              <div className="space-y-2">
                <FormInput
                  id="email"
                  type="email"
                  placeholder="robot@email.com"
                  registration={register("email")}
                  error={errors.email?.message}
                  label={`${t("auth.email")}(${t("auth.optional")})`}
                />
              </div>

              {/* 약관 동의 */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-2">
                  <Controller
                    name="agreeTerms"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="agreeTerms"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                        className="h-5 w-5"
                      />
                    )}
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <span className="text-red-500">{t("auth.requiredMark")}</span>
                    {t("auth.agreeTerms")}
                  </label>
                </div>

                <div className="flex items-start space-x-2">
                  <Controller
                    name="agreePrivacy"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="agreePrivacy"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                        className="h-5 w-5"
                      />
                    )}
                  />
                  <label
                    htmlFor="agreePrivacy"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <span className="text-red-500">{t("auth.requiredMark")}</span>{" "}
                    {t("auth.agreePrivacy")}
                  </label>
                </div>

                {errors.agreeTerms?.message && (
                  <p className="text-sm text-red-500">{errors.agreeTerms.message}</p>
                )}
              </div>

              <Button className="w-full h-11">{t("auth.signupButton")}</Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-gray-600">{t("auth.haveAccount")} </span>
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                {t("auth.login")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </FullWidthSection>
  );
}
