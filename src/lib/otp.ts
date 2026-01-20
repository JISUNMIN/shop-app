import crypto from "crypto";
import type { AxiosError } from "axios";
import type { TFunction } from "i18next";

const PHONE_OTP_SECRET = "long-long-random-secret";

type ApiErrorData = {
  messageKey?: string;
  messageParams?: Record<string, unknown>;
};

/** 6자리 코드 생성 */
export function generateCode() {
  // 000000 ~ 999999
  const n = crypto.randomInt(0, 1000000);
  return String(n).padStart(6, "0");
}

export function hashCode(phone: string, code: string) {
  return crypto.createHmac("sha256", PHONE_OTP_SECRET).update(`${phone}:${code}`).digest("hex");
}

export function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function getApiMessage(e: unknown, t: TFunction, fallback: string): string {
  const err = e as AxiosError<ApiErrorData> | undefined;
  const data = err?.response?.data;

  if (data?.messageKey) return t(data.messageKey, data.messageParams);
  return (err as { message?: string } | undefined)?.message ?? fallback;
}
