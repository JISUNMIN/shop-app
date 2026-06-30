"use client";

import { useTranslation } from "react-i18next";

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="-mx-4 bg-white sm:-mx-6 lg:-mx-8">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="space-y-8">
          <header className="rounded-[1.75rem] bg-[linear-gradient(135deg,#f8fbff_0%,#eef5fb_100%)] px-6 py-8 shadow-sm ring-1 ring-slate-200 md:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--link-accent)]">
              Legal
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-950">
              {t("legal.terms.title")}
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              {t("legal.updatedAt", { date: "2026-02-06" })}
            </p>
          </header>

          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-6 text-sm leading-7 text-slate-600">
              <p>{t("legal.terms.intro")}</p>

              <section>
                <h2 className="text-lg font-semibold text-slate-950">{t("legal.terms.s1.title")}</h2>
                <p className="mt-2">{t("legal.terms.s1.body")}</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-slate-950">{t("legal.terms.s2.title")}</h2>
                <p className="mt-2">{t("legal.terms.s2.body")}</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-slate-950">{t("legal.terms.s3.title")}</h2>
                <p className="mt-2">{t("legal.terms.s3.body")}</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-slate-950">{t("legal.terms.s4.title")}</h2>
                <p className="mt-2">{t("legal.terms.s4.body")}</p>
              </section>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
