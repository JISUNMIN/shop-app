"use client";

import { Shield, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GuideCard, Step } from "./parts";
import type { Guide, Product } from "@/types";
import { pickI18n } from "@/utils/helper";

export default function TabGuide({ product }: { product: Product }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const guide = ((product as any).guide ?? {}) as Guide;
  const sections = guide.sections ?? [];

  if (sections.length === 0) {
    return (
      <div className="space-y-8">
        <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
          <h2 className="text-2xl font-semibold mb-4">{t("product.productTabs.guide")}</h2>
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <Info className="w-5 h-5 text-gray-500 mt-0.5" />
            <p>{t("productGuide.empty")}</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            {t("productGuide.cautionTitle")}
          </h3>
          <p className="text-sm text-gray-700">{t("productGuide.emptyCaution")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sections.map((section, idx) => {
        const title = pickI18n(section.title, lang);

        if (section.type === "steps") {
          return (
            <div key={idx} className="bg-gray-50 rounded-lg p-6 sm:p-8">
              <h2 className="text-2xl font-semibold mb-6">{title}</h2>
              <div className="space-y-6">
                {(section.items ?? []).map((s, i) => (
                  <Step
                    key={i}
                    num={i + 1}
                    title={pickI18n(s.title, lang)}
                    desc={pickI18n(s.desc, lang)}
                  />
                ))}
              </div>
            </div>
          );
        }

        if (section.type === "cards") {
          return (
            <div key={idx} className="bg-gray-50 rounded-lg p-6 sm:p-8">
              <h2 className="text-2xl font-semibold mb-6">{title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(section.items ?? []).map((c, i) => (
                  <GuideCard key={i} cmd={pickI18n(c.cmd, lang)} desc={pickI18n(c.desc, lang)} />
                ))}
              </div>
            </div>
          );
        }

        if (section.type === "bullets") {
          return (
            <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                {title || t("productGuide.cautionTitle")}
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {(section.items ?? []).map((item, i) => (
                  <li key={i}>• {pickI18n(item, lang)}</li>
                ))}
              </ul>
            </div>
          );
        }

        return (
          <div key={idx} className="bg-gray-50 rounded-lg p-6 sm:p-8">
            {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {pickI18n((section as any).body, lang)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
