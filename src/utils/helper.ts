// src/utils/helper.ts
export function formatString(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : "",
  );
}

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


export const formatKoreanMobile = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11); // 숫자만 + 최대 11자리

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};
