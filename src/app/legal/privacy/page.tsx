"use client";

import { useTranslation } from "react-i18next";

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{t("legal.privacy.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("legal.updatedAt", { date: "2026-02-06" })}
        </p>
      </header>

      <div className="prose prose-sm max-w-none dark:prose-invert">
        <p>{t("legal.privacy.intro")}</p>
        <br />

        <h2>{t("legal.privacy.s1.title")}</h2>
        <ul>
          <li>{t("legal.privacy.s1.b1")}</li>
          <li>{t("legal.privacy.s1.b2")}</li>
        </ul>

        <h2>{t("legal.privacy.s2.title")}</h2>
        <p>{t("legal.privacy.s2.body")}</p>

        <h2>{t("legal.privacy.s3.title")}</h2>
        <p>{t("legal.privacy.s3.body")}</p>

        <h2>{t("legal.privacy.s4.title")}</h2>
        <p>
          {t("legal.privacy.s4.body")}{" "}
          <a href="mailto:privacy@roboshop.co.kr">privacy@roboshop.co.kr</a>
        </p>
      </div>
    </div>
  );
}
