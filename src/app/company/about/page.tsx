"use client";

import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{t("company.about.title")}</h1>
        <p className="text-muted-foreground">{t("company.about.subtitle")}</p>
      </header>

      <section className="rounded-lg border p-6 space-y-3">
        <h2 className="text-lg font-semibold">{t("company.about.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("company.about.workBody")}</p>
      </section>

      <section className="rounded-lg border p-6 space-y-3">
        <h2 className="text-lg font-semibold">{t("company.about.contactTitle")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("company.about.contactBody")}{" "}
          <a className="underline" href="mailto:biz@roboshop.co.kr">
            biz@roboshop.co.kr
          </a>
        </p>
      </section>
    </div>
  );
}
