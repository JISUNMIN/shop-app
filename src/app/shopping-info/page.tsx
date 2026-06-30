"use client";

import { useTranslation } from "react-i18next";

export default function ShoppingInfoPage() {
  const { t } = useTranslation();

  return (
    <div className="-mx-4 bg-white sm:-mx-6 lg:-mx-8">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="space-y-8">
          <header className="rounded-[1.75rem] bg-[linear-gradient(135deg,#f8fbff_0%,#eef5fb_100%)] px-6 py-8 shadow-sm ring-1 ring-slate-200 md:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--link-accent)]">
              Shopping Guide
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-950">
              {t("shoppingInfo.title")}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
              {t("shoppingInfo.subtitle")}
            </p>
          </header>

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">{t("shoppingInfo.shipping.title")}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-500">
              <li>{t("shoppingInfo.shipping.b1")}</li>
              <li>
                {t("shoppingInfo.shipping.b2.label")}{" "}
                <span className="font-semibold text-emerald-600">{t("shoppingInfo.shipping.b2.value")}</span>
              </li>
              <li>{t("shoppingInfo.shipping.b3")}</li>
            </ul>
          </section>

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">{t("shoppingInfo.returns.title")}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-500">
              <li>{t("shoppingInfo.returns.b1")}</li>
              <li>{t("shoppingInfo.returns.b2")}</li>
              <li>{t("shoppingInfo.returns.b3")}</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
