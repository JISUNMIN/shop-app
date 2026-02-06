"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function SupportPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{t("support.title")}</h1>
        <p className="text-muted-foreground">{t("support.subtitle")}</p>
      </header>

      <section className="rounded-lg border p-6 space-y-3">
        <h2 className="text-lg font-semibold">{t("support.contact.title")}</h2>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{t("support.contact.hours")}</p>
          <p>
            {t("support.contact.inquiry")}{" "}
            <a className="underline" href="mailto:support@roboshop.co.kr">
              support@roboshop.co.kr
            </a>
          </p>
        </div>
      </section>

      <section id="faq" className="space-y-4">
        <h2 className="text-lg font-semibold">{t("support.faq.title")}</h2>

        <div className="space-y-3">
          <details className="rounded-lg border p-4">
            <summary className="cursor-pointer font-medium">{t("support.faq.q1")}</summary>
            <p className="mt-2 text-sm text-muted-foreground">{t("support.faq.a1")}</p>
          </details>

          <details className="rounded-lg border p-4">
            <summary className="cursor-pointer font-medium">{t("support.faq.q2")}</summary>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("support.faq.a2")}{" "}
              <Link className="underline" href="/shopping-info">
                {t("support.faq.link")}
              </Link>
            </p>
          </details>

          <details className="rounded-lg border p-4">
            <summary className="cursor-pointer font-medium">{t("support.faq.q3")}</summary>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("support.faq.a3.prefix")}{" "}
              <Link className="underline" href="/shopping-info">
                {t("support.faq.a3.link")}
              </Link>
              {t("support.faq.a3.suffix")}
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
