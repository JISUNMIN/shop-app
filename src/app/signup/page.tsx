"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Controller, useForm } from "react-hook-form";
import FullWidthSection from "@/components/layout/FullWidthSection";
import SNSButton from "@/components/common/SNSButton";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "@/components/common/FormInput";
import { useTranslation } from "@/context/TranslationContext";
import useSignup from "@/hooks/useSignup";
import { useState } from "react";

type SignupForm = {
  userId: string;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  mobileNumber: string;
  mobileCode: string;
};

export default function SignupPage() {
  const router = useRouter();
  const { auth } = useTranslation();
  const { signupMutate, isSignupPending } = useSignup();
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);

  const schema = yup
    .object({
      userId: yup
        .string()
        .required(auth.validation.userIdRequired)
        .matches(/^[a-zA-Z0-9]+$/, auth.validation.userIdInvalid)
        .min(4, auth.validation.minLength4)
        .max(16, auth.validation.maxLength16),
      password: yup
        .string()
        .required(auth.validation.passwordRequired)
        .min(8, auth.passwordPlaceholder),

      passwordConfirm: yup
        .string()
        .required(auth.validation.passwordConfirmRequired)
        .min(8, auth.passwordPlaceholder)
        .oneOf([yup.ref("password")], auth.validation.passwordMismatch),

      mobileNumber: yup
        .string()
        .required(auth.validation.mobileNumberRequired)
        .transform((value) => (value ? value.replace(/-/g, "").trim() : value))
        .matches(/^\d{10,11}$/, auth.validation.mobileNumberInvalid),

      mobileCode: yup
        .string()
        .required(auth.validation.mobileCodeRequired)
        .transform((value) => (value ? value.trim() : value))
        .matches(/^\d{4,6}$/, auth.validation.mobileCodeInvalid),

      name: yup
        .string()
        .required(auth.validation.nameRequired)
        .max(4, auth.validation.nameMaxLength),

      email: yup.string().notRequired().email(auth.validation.emailInvalid),

      agreeTerms: yup
        .boolean()
        .oneOf([true], auth.validation.agreeTermsRequired)
        .required(auth.validation.agreeTermsRequired),

      agreePrivacy: yup
        .boolean()
        .oneOf([true], auth.validation.agreePrivacyRequired)
        .required(auth.validation.agreePrivacyRequired),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,

    getValues,
    setError,
    clearErrors,
  } = useForm<SignupForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      agreeTerms: false,
      agreePrivacy: false,
    },
  });

  const onSubmit = async (data: SignupForm) => {
    console.log(data);
    try {
      await signupMutate({ name: data.name, email: data.email, password: data.password });
      router.push("/login");
    } catch {}
  };

  const handleSNSSignup = (provider: string) => {
    console.log(`${provider} 회원가입 시도`);
    router.push("/");
  };

  const handleSendCode = async () => {
    const mobileNumber = getValues("mobileNumber")?.trim();

    if (!mobileNumber) {
      setError("mobileNumber", {
        type: "manual",
        message: auth.validation.mobileNumberRequired,
      });
      return;
    }

    // 숫자만 허용 입력이지만 혹시 몰라 한번 더 안전하게
    if (!/^\d{10,11}$/.test(mobileNumber)) {
      setError("mobileNumber", {
        type: "manual",
        message: auth.validation.mobileNumberInvalid,
      });
      return;
    }

    clearErrors("mobileNumber");
    setIsSendingCode(true);

    try {
      // TODO: 인증번호 발송 API 호출
      // await sendMobileCode({ mobileNumber });

      setCodeSent(true);
      setMobileVerified(false);
      clearErrors("mobileCode");
    } catch (e: any) {
      setError("mobileNumber", {
        type: "manual",
        message: e?.message ?? auth.validation.mobileNumberInvalid,
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    const mobileNumber = getValues("mobileNumber")?.trim();
    const mobileCode = getValues("mobileCode")?.trim();

    if (!codeSent) {
      setError("mobileCode", {
        type: "manual",
        message: auth.validation.sendCodeFirst,
      });
      return;
    }

    if (!mobileCode) {
      setError("mobileCode", {
        type: "manual",
        message: auth.validation.mobileCodeRequired,
      });
      return;
    }

    if (!/^\d{4,6}$/.test(mobileCode)) {
      setError("mobileCode", {
        type: "manual",
        message: auth.validation.mobileCodeInvalid,
      });
      return;
    }

    clearErrors("mobileCode");
    setIsVerifyingCode(true);

    try {
      // TODO: 인증번호 확인 API 호출
      // await verifyMobileCode({ mobileNumber, mobileCode });

      setMobileVerified(true);
    } catch (e: any) {
      setMobileVerified(false);
      setError("mobileCode", {
        type: "manual",
        message: e?.message ?? auth.validation.mobileCodeInvalid,
      });
    } finally {
      setIsVerifyingCode(false);
    }
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
            <CardTitle className="text-2xl text-center">{auth.signupTitle}</CardTitle>
            <CardDescription className="text-center">{auth.signupDescription}</CardDescription>
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
                <span className="bg-white px-2 text-gray-500">{auth.orEmailSignup}</span>
              </div>
            </div>

            {/* Email Signup Form */}
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <FormInput
                  id="userId"
                  placeholder={auth.placeholders.userIdPlaceholder}
                  registration={register("userId")}
                  error={errors.userId?.message}
                  label={auth.userId}
                />
              </div>

              <div className="space-y-2">
                <FormInput
                  id="password"
                  type="password"
                  placeholder={auth.passwordPlaceholder}
                  registration={register("password")}
                  error={errors.password?.message}
                  label={auth.password}
                />
              </div>

              <div className="space-y-2">
                <FormInput
                  id="confirmPassword"
                  type="password"
                  placeholder={auth.confirmPasswordPlaceholder}
                  registration={register("passwordConfirm")}
                  error={errors.passwordConfirm?.message}
                  label={auth.confirmPassword}
                />
              </div>

              <div className="space-y-2">
                <FormInput
                  id="name"
                  placeholder={auth.placeholders.nameExample}
                  registration={register("name")}
                  error={errors.name?.message}
                  label={auth.name}
                />
              </div>

              <div className="space-y-2">
                <FormInput
                  id="mobileNumber"
                  placeholder={auth.placeholders.mobileNumberExample}
                  registration={register("mobileNumber", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    },
                  })}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={11}
                  error={errors.mobileNumber?.message}
                  label={auth.mobileNumber}
                  rightElement={
                    <Button
                      type="button"
                      className="h-10 px-3 whitespace-nowrap"
                      onClick={handleSendCode}
                      disabled={isSendingCode}
                    >
                      {isSendingCode ? auth.sending : auth.sendCode}
                    </Button>
                  }
                />
              </div>

              <div className="space-y-2">
                <FormInput
                  id="mobileCode"
                  label={auth.mobileVerification}
                  placeholder={auth.placeholders.mobileCodeExample}
                  registration={register("mobileCode", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    },
                  })}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  error={errors.mobileCode?.message}
                  rightElement={
                    <Button
                      type="button"
                      className="h-10 px-3 whitespace-nowrap"
                      onClick={handleVerifyCode}
                      disabled={isVerifyingCode}
                    >
                      {isVerifyingCode ? auth.verifying : auth.verify}
                    </Button>
                  }
                />
              </div>

              <div className="space-y-2">
                <FormInput
                  id="email"
                  type="email"
                  placeholder="robot@email.com"
                  registration={register("email")}
                  error={errors.email?.message}
                  label={`${auth.email}(${auth.optional})`}
                />
              </div>

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
                    <span className="text-red-500">{auth.requiredMark}</span> {auth.agreeTerms}
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
                    <span className="text-red-500">{auth.requiredMark}</span> {auth.agreePrivacy}
                  </label>
                </div>

                {errors.agreeTerms?.message && (
                  <p className="text-sm text-red-500">{errors.agreeTerms.message}</p>
                )}
              </div>

              <Button className="w-full h-11">{auth.signupButton}</Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-gray-600">{auth.haveAccount} </span>
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                {auth.login}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </FullWidthSection>
  );
}
