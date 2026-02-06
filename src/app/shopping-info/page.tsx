"use client";

import { useTranslation } from "react-i18next";

export default function ShoppingInfoPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{t("shoppingInfo.title")}</h1>
        <p className="text-muted-foreground">{t("shoppingInfo.subtitle")}</p>
      </header>

      <section className="rounded-lg border p-6 space-y-3">
        <h2 className="text-lg font-semibold">{t("shoppingInfo.shipping.title")}</h2>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>{t("shoppingInfo.shipping.b1")}</li>
          <li>{t("shoppingInfo.shipping.b2")}</li>
          <li className="text-sm text-muted-foreground">
            {t("shoppingInfo.shipping.b2.label")}{" "}
            <span className="font-medium text-green-600">
              {t("shoppingInfo.shipping.b2.value")}
            </span>
          </li>
        </ul>
      </section>

      <section className="rounded-lg border p-6 space-y-3">
        <h2 className="text-lg font-semibold">{t("shoppingInfo.returns.title")}</h2>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>{t("shoppingInfo.returns.b1")}</li>
          <li>{t("shoppingInfo.returns.b2")}</li>
          <li>{t("shoppingInfo.returns.b3")}</li>
        </ul>
      </section>
    </div>
  );
}
