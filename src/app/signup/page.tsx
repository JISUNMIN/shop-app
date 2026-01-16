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

type SignupForm = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
};

export default function SignupPage() {
  const router = useRouter();
  const { auth } = useTranslation();

  const schema = yup
    .object({
      name: yup.string().required(auth.validation.nameRequired).max(4, auth.validation.nameMax),

      email: yup
        .string()
        .required(auth.validation.emailRequired)
        .email(auth.validation.emailInvalid),

      password: yup.string().required(auth.validation.passwordRequired),

      passwordConfirm: yup
        .string()
        .required(auth.validation.passwordConfirmRequired)
        .oneOf([yup.ref("password")], auth.validation.passwordMismatch),

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
  } = useForm<SignupForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      agreeTerms: false,
      agreePrivacy: false,
    },
  });

  const onSubmit = (data: SignupForm) => {
    console.log(data);
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
                  id="name"
                  placeholder={auth.placeholders.nameExample}
                  registration={register("name")}
                  error={errors.name?.message}
                  label={auth.name}
                />
              </div>

              <div className="space-y-2">
                <FormInput
                  id="email"
                  type="email"
                  placeholder="robot@email.com"
                  registration={register("email")}
                  error={errors.email?.message}
                  label={auth.email}
                />
              </div>

              <div className="space-y-2">
                <FormInput
                  id="password"
                  type="password"
                  placeholder={auth.passwordPlaceholder}
                  minLength={8}
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
                  minLength={8}
                  registration={register("passwordConfirm")}
                  error={errors.passwordConfirm?.message}
                  label={auth.confirmPassword}
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

              <Button type="submit" className="w-full h-11">
                {auth.signupButton}
              </Button>
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
