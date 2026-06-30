"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function SupportPage() {
  const { t } = useTranslation();

  return (
    <div className="-mx-4 bg-white sm:-mx-6 lg:-mx-8">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="space-y-8">
          <header className="rounded-[1.75rem] bg-[linear-gradient(135deg,#f8fbff_0%,#eef5fb_100%)] px-6 py-8 shadow-sm ring-1 ring-slate-200 md:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--link-accent)]">
              Customer Support
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-950">
              {t("support.title")}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
              {t("support.subtitle")}
            </p>
          </header>

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">{t("support.contact.title")}</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-500">
              <p>{t("support.contact.hours")}</p>
              <p>
                {t("support.contact.inquiry")}{" "}
                <a className="font-medium text-[color:var(--link-accent)] underline" href="mailto:support@roboshop.co.kr">
                  support@roboshop.co.kr
                </a>
              </p>
            </div>
          </section>

          <section id="faq" className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-950">{t("support.faq.title")}</h2>

            <div className="space-y-3">
              <details className="rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm">
                <summary className="cursor-pointer font-medium text-slate-900">
                  {t("support.faq.q1")}
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-500">{t("support.faq.a1")}</p>
              </details>

              <details className="rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm">
                <summary className="cursor-pointer font-medium text-slate-900">
                  {t("support.faq.q2")}
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {t("support.faq.a2")}{" "}
                  <Link className="font-medium text-[color:var(--link-accent)] underline" href="/shopping-info">
                    {t("support.faq.link")}
                  </Link>
                </p>
              </details>

              <details className="rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm">
                <summary className="cursor-pointer font-medium text-slate-900">
                  {t("support.faq.q3")}
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {t("support.faq.a3.prefix")}{" "}
                  <Link className="font-medium text-[color:var(--link-accent)] underline" href="/shopping-info">
                    {t("support.faq.a3.link")}
                  </Link>
                  {t("support.faq.a3.suffix")}
                </p>
              </details>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
