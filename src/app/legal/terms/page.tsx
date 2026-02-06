"use client";

import { useTranslation } from "react-i18next";

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{t("legal.terms.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("legal.updatedAt", { date: "2026-02-06" })}</p>
      </header>

      <div className="prose prose-sm max-w-none dark:prose-invert">
        <p>{t("legal.terms.intro")}</p>
        <br/>

        <h2>{t("legal.terms.s1.title")}</h2>
        <p>{t("legal.terms.s1.body")}</p>

        <h2>{t("legal.terms.s2.title")}</h2>
        <p>{t("legal.terms.s2.body")}</p>

        <h2>{t("legal.terms.s3.title")}</h2>
        <p>{t("legal.terms.s3.body")}</p>

        <h2>{t("legal.terms.s4.title")}</h2>
        <p>{t("legal.terms.s4.body")}</p>
      </div>
    </div>
  );
}
