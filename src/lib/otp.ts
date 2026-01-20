import crypto from "crypto";

const PHONE_OTP_SECRET = "long-long-random-secret";

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

export function getApiMessage(e: any, t: any, fallback: string) {
  const data = e?.response?.data;
  if (data?.messageKey) return t(data.messageKey, data.messageParams);
  return e?.message ?? fallback;
};