"use client";

import Link from "next/link";
import { Bot } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div aria-hidden>
                <Bot className="w-5 h-5 text-white/80" />
              </div>

              <span className="text-lg font-extrabold tracking-tight text-white">
                Robo<span className="text-[color:var(--button-bg)]">Shop</span>
              </span>
            </div>
            <p className="text-sm text-gray-400">{t("footer.brandTagline")}</p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">{t("footer.support.title")}</h4>
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
            <h4 className="font-bold text-white mb-4">{t("footer.shopping.title")}</h4>
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
            <h4 className="font-bold text-white mb-4">{t("footer.company.title")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/company/about"
                  className="transition-colors hover:text-[color:var(--link-accent)]"
                >
                  {t("footer.company.about")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/80 mt-8 pt-8 text-sm text-gray-500 text-center">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
