"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RoboShopLogo from "@/components/common/RoboShopLogo";
import { useTranslation } from "react-i18next";
import useForgotPassword from "@/hooks/useForgotPassword";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { requestForgotPasswordAsync, isRequestForgotPasswordPending } = useForgotPassword();

  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(true);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMsg(null);

    try {
      await requestForgotPasswordAsync({ userId, phone });
      setIsSubmitted(true);
    } catch (err) {
      const error = err as AxiosError<{ errorKey?: string }>;
      const errorKey = error.response?.data?.errorKey;

      setErrorMsg(errorKey ? t(errorKey) : t("auth.serverError.serverError"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <RoboShopLogo
        className="flex items-center justify-center gap-2 mb-8"
        botClassName="w-8 h-8"
        textClassName="text-2xl"
      />

      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{t("auth.forgotPasswordTitle")}</CardTitle>
            <CardDescription className="text-center">
              {isSubmitted
                ? t("auth.forgotPasswordDescriptionSubmitted")
                : t("auth.forgotPasswordDescriptionDefault")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!isSubmitted ? (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="username">{t("auth.userId")}</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder={t("auth.placeholders.userIdPlaceholder")}
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      required
                      autoComplete="username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("auth.forgotPasswordPhoneLabel")}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="010-0000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      autoComplete="tel"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-lg border border-red-200 bg-red-50">
                      <p className="text-sm text-red-700 text-center">{errorMsg}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isRequestForgotPasswordPending}
                  >
                    {isRequestForgotPasswordPending
                      ? t("loading")
                      : t("auth.forgotPasswordSubmitButton")}
                  </Button>
                </form>

                <div className="text-center text-sm space-y-2">
                  <span className="text-gray-600">
                    {t("auth.forgotPasswordRememberedPassword")}{" "}
                  </span>
                  <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    {t("auth.login")}
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>

                    <p className="text-sm text-green-800">
                      {t("auth.forgotPasswordSuccessInstructionLine1")}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      // 전송 로직은 아직 X -> 안내만
                      toast.info(t("auth.forgotPasswordResendAlert"));
                    }}
                  >
                    {t("auth.forgotPasswordResendButton")}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsSubmitted(false);
                      setUserId("");
                      setPhone("");
                      setErrorMsg(null);
                    }}
                  >
                    {t("auth.forgotPasswordTryAnotherButton")}
                  </Button>
                </div>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t("auth.forgotPasswordBackToLogin")}
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 도움말 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            <strong>{t("auth.forgotPasswordHelpTitle")}</strong>
            <br />
            {t("auth.forgotPasswordHelpDescription")}
          </p>
        </div>
      </div>
    </div>
  );
}
