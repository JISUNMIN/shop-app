// src/utils/helper.ts
export function formatString(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : ""
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
