// components/common/SNSButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SNSType } from "@/types";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface SNSButtonProps {
  type: SNSType;
  hasLabel?: boolean;
  className?: string;
}

export default function SNSButton({ type, hasLabel = false, className }: SNSButtonProps) {
  const { t } = useTranslation();

  const provider = t(`sns.${type}`);
  const ariaLabel = t("sns.loginWith", { provider });
  const label = t("sns.startWith", { provider });

  const handleSNSSignup = async () => {
    if (type === "kakao") {
      const res = await signIn(type, {
        callbackUrl: "/",
      });
    }
  };

  if (type === "naver") {
    return (
      <Button
        variant="outline"
        type="button"
        className={cn("w-full hover:bg-green-50", className)}
        aria-label={ariaLabel}
        onClick={handleSNSSignup}
      >
        <span className="text-[#03C75A] text-xl font-extrabold leading-none">N</span>
        {hasLabel && <span>{label}</span>}
      </Button>
    );
  }

  if (type === "kakao") {
    return (
      <Button
        variant="outline"
        type="button"
        className={cn("w-full hover:bg-yellow-50", className)}
        aria-label={ariaLabel}
        onClick={handleSNSSignup}
      >
        <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path
              fill="black"
              d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7L6 22l4.4-2.6c.5.1 1 .1 1.6.1 5.5 0 10-3.6 10-8S17.5 3 12 3z"
            />
          </svg>
        </div>
        {hasLabel && <span>{label}</span>}
      </Button>
    );
  }

  if (type === "google") {
    return (
      <Button
        variant="outline"
        type="button"
        className={cn("w-full bg-gray-50", className)}
        aria-label={ariaLabel}
        onClick={handleSNSSignup}
      >
        <Image
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E"
          alt={provider}
          className="w-5 h-5"
        />
        {hasLabel && <span>{label}</span>}
      </Button>
    );
  }

  return null;
}
