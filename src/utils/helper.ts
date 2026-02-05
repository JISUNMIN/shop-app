// src/utils/helper.ts
import { LangCode, LocalizedText } from "@/types";

// 고정 환율 (1 KRW = 0.00075 USD), 실시간 환율 적용 필요
const KRW_TO_USD = 0.00075;

export const formatPrice = (price: number, lang: "ko" | "en" = "ko") => {
  if (lang === "ko") {
    return new Intl.NumberFormat("ko-KR").format(price);
  } else {
    const usdPrice = price * KRW_TO_USD;
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(usdPrice);
  }
};

export const getAvatarText = (name?: string | null): string => {
  const raw = name?.trim() || "?";
  if (!raw || raw === "?") return "?";

  // 한글이면 앞 2글자
  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(raw)) {
    return raw.slice(0, 2);
  }

  // 영어면 단어 이니셜 조합 (최대 2개)
  const parts = raw.split(" ").filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return initials || raw.charAt(0).toUpperCase();
};

export const formatKoreanMobile = (value: string | null | undefined) => {
  if (!value) return;
  const digits = value.replace(/\D/g, "").slice(0, 11); // 숫자만 + 최대 11자리

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

export const formatDate = (date: string, lang: LangCode) => {
  const locale = lang === "ko" ? "ko-KR" : "en-US";
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export function pickI18n(value: unknown, lang: string) {
  if (!value) return "";
  if (typeof value === "string") return value;

  const v = value as LocalizedText;
  const isKo = lang?.startsWith("ko");
  return (isKo ? v.ko : v.en) ?? v.ko ?? v.en ?? "";
}
