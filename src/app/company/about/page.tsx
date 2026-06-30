"use client";

import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="-mx-4 bg-white sm:-mx-6 lg:-mx-8">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="space-y-8">
          <header className="rounded-[1.75rem] bg-[linear-gradient(135deg,#f8fbff_0%,#eef5fb_100%)] px-6 py-8 shadow-sm ring-1 ring-slate-200 md:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--link-accent)]">
              Company
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-950">
              {t("company.about.title")}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
              {t("company.about.subtitle")}
            </p>
          </header>

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">{t("company.about.workTitle")}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">{t("company.about.workBody")}</p>
          </section>

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">{t("company.about.contactTitle")}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {t("company.about.contactBody")}{" "}
              <a className="font-medium text-[color:var(--link-accent)] underline" href="mailto:biz@roboshop.co.kr">
                biz@roboshop.co.kr
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
