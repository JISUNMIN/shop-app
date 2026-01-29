import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GUEST_CART_COOKIE } from "./utils/cart";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // 로그인 페이지: 이미 로그인(세션 쿠키 있음) 시 홈으로 리다이렉트
  if (pathname === "/login") {
    const hasSession =
      req.cookies.get("authjs.session-token") ||
      req.cookies.get("__Secure-authjs.session-token") ||
      req.cookies.get("next-auth.session-token") ||
      req.cookies.get("__Secure-next-auth.session-token");

    if (hasSession) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // 장바구니 관련 경로 접근 시 guest session 쿠키 보장
  const isCartRelated = pathname === "/cart";
  if (isCartRelated) {
    const existing = req.cookies.get(GUEST_CART_COOKIE)?.value;

    if (!existing) {
      const newId = `session_${crypto.randomUUID()}`;

      res.cookies.set(GUEST_CART_COOKIE, newId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  }

  return res;
}

export const config = {
  matcher: ["/login", "/cart"],
};
