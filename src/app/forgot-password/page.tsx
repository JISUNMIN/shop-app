"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FullWidthSection from "@/components/layout/FullWidthSection";
import { useTranslation } from "@/context/TranslationContext";

export default function ForgotPasswordPage() {
  const { auth } = useTranslation();

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
            <CardTitle className="text-2xl text-center">{auth.forgotPasswordTitle}</CardTitle>
            <CardDescription className="text-center">
              {isSubmitted
                ? auth.forgotPasswordDescriptionSubmitted
                : auth.forgotPasswordDescriptionDefault}
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
                    <Label htmlFor="email">{auth.forgotPasswordEmailLabel}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={auth.forgotPasswordEmailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {auth.forgotPasswordSubmitButton}
                  </Button>
                </form>

                <div className="text-center text-sm space-y-2">
                  <div>
                    <span className="text-gray-600">{auth.forgotPasswordRememberedPassword} </span>
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                      {auth.login}
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 text-center">
                    <strong>{email}</strong>
                    {auth.forgotPasswordSuccessSentToSuffix}
                    <br />
                    {auth.forgotPasswordSuccessInstructionLine1}
                  </p>
                </div>

                {/* 재발송 */}
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-gray-700">
                      {auth.forgotPasswordResendTitle}
                    </p>
                    <p className="text-xs text-gray-500">{auth.forgotPasswordResendHint}</p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      console.log("Resending email to:", email);
                      alert(auth.forgotPasswordResendAlert);
                    }}
                  >
                    {auth.forgotPasswordResendButton}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                  >
                    {auth.forgotPasswordTryAnotherEmailButton}
                  </Button>
                </div>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {auth.forgotPasswordBackToLogin}
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
              <strong>{auth.forgotPasswordHelpTitle}</strong>
              <br />
              {auth.forgotPasswordHelpDescription}
            </p>
          </div>
        )}
      </div>
    </FullWidthSection>
  );
}
