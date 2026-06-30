"use client";

import Link from "next/link";
import { Bot } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200 bg-[linear-gradient(180deg,#0f172a_0%,#0b1220_100%)] text-gray-300">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div className="rounded-[1.75rem] border border-white/8 bg-white/5 p-6 shadow-[0_22px_55px_-34px_rgba(0,0,0,0.55)]">
            <div className="mb-4 flex items-center gap-3">
              <div aria-hidden>
                <Bot className="w-5 h-5 text-white/80" />
              </div>

              <span className="text-lg font-extrabold tracking-tight text-white">
                Robo<span className="text-[color:var(--button-bg)]">Shop</span>
              </span>
            </div>
            <p className="max-w-sm text-sm leading-6 text-gray-400">{t("footer.brandTagline")}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/special-offers"
                className="rounded-full border border-white/10 bg-white/7 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/12 hover:text-white"
              >
                특가 모아보기
              </Link>
              <Link
                href="/rental-service"
                className="rounded-full border border-white/10 bg-white/7 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/12 hover:text-white"
              >
                렌탈 서비스
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
              {t("footer.support.title")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/support"
                  className="transition-colors hover:text-[color:var(--link-accent)]"
                >
                  {t("footer.support.center")}
                </Link>
              </li>
              <li>
                <Link
                  href="/support#faq"
                  className="transition-colors hover:text-[color:var(--link-accent)]"
                >
                  {t("footer.support.faq")}
                </Link>
              </li>
              <li>
                <Link
                  href="/demo-guide"
                  className="transition-colors hover:text-[color:var(--link-accent)]"
                >
                  {t("footer.support.demoGuide")}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@roboshop.co.kr?subject=RoboShop%201%3A1%20Inquiry"
                  className="transition-colors hover:text-[color:var(--link-accent)]"
                >
                  {t("footer.support.inquiry")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
              {t("footer.shopping.title")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/shopping-info"
                  className="transition-colors hover:text-[color:var(--link-accent)]"
                >
                  {t("footer.shopping.shippingReturns")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="transition-colors hover:text-[color:var(--link-accent)]"
                >
                  {t("footer.shopping.terms")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="transition-colors hover:text-[color:var(--link-accent)]"
                >
                  {t("footer.shopping.privacy")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
              {t("footer.company.title")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/company/about"
                  className="transition-colors hover:text-[color:var(--link-accent)]"
                >
                  {t("footer.company.about")}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:biz@roboshop.co.kr"
                  className="transition-colors hover:text-[color:var(--link-accent)]"
                >
                  biz@roboshop.co.kr
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800/80 pt-8 text-center text-sm text-gray-500">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
