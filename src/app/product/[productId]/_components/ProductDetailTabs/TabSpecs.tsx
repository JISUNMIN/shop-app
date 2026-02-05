"use client";

import React from "react";
import { Battery, Camera, Mic, Package, Speaker, Wifi } from "lucide-react";
import { useTranslation } from "react-i18next";
import { InfoRow } from "./parts";
import type { Product, Specs } from "@/types";
import { pickI18n } from "@/utils/helper";

function SpecItem({
  icon,
  iconWrapClassName,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconWrapClassName: string;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconWrapClassName}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium">{value || "-"}</p>
      </div>
    </div>
  );
}

export default function TabSpecs({ product }: { product: Product }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const specs = ((product as any).specs ?? {}) as Specs;

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
        <h2 className="text-2xl font-semibold mb-6">{t("productSpecs.basicTitle")}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SpecItem
            icon={<Package className="w-5 h-5" />}
            iconWrapClassName="bg-blue-100 text-blue-600"
            label={t("productSpecs.size")}
            value={pickI18n(specs.basic?.size, lang)}
          />
          <SpecItem
            icon={<Battery className="w-5 h-5" />}
            iconWrapClassName="bg-green-100 text-green-600"
            label={t("productSpecs.weight")}
            value={pickI18n(specs.basic?.weight, lang)}
          />
          <SpecItem
            icon={<Wifi className="w-5 h-5" />}
            iconWrapClassName="bg-purple-100 text-purple-600"
            label={t("productSpecs.connect")}
            value={pickI18n(specs.basic?.connect, lang)}
          />
          <SpecItem
            icon={<Camera className="w-5 h-5" />}
            iconWrapClassName="bg-orange-100 text-orange-600"
            label={t("productSpecs.camera")}
            value={pickI18n(specs.basic?.camera, lang)}
          />
          <SpecItem
            icon={<Mic className="w-5 h-5" />}
            iconWrapClassName="bg-red-100 text-red-600"
            label={t("productSpecs.mic")}
            value={pickI18n(specs.basic?.mic, lang)}
          />
          <SpecItem
            icon={<Speaker className="w-5 h-5" />}
            iconWrapClassName="bg-yellow-100 text-yellow-700"
            label={t("productSpecs.speaker")}
            value={pickI18n(specs.basic?.speaker, lang)}
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
        <h2 className="text-2xl font-semibold mb-6">{t("productSpecs.performanceTitle")}</h2>
        <div className="space-y-3 text-sm">
          <InfoRow
            label={t("productSpecs.cpu")}
            value={pickI18n(specs.performance?.cpu, lang) || "-"}
          />
          <InfoRow
            label={t("productSpecs.ram")}
            value={pickI18n(specs.performance?.ram, lang) || "-"}
          />
          <InfoRow
            label={t("productSpecs.storage")}
            value={pickI18n(specs.performance?.storage, lang) || "-"}
          />
          <InfoRow
            label={t("productSpecs.battery")}
            value={pickI18n(specs.performance?.battery, lang) || "-"}
          />
          <InfoRow
            label={t("productSpecs.charge")}
            value={pickI18n(specs.performance?.charge, lang) || "-"}
          />
          <InfoRow
            label={t("productSpecs.os")}
            value={pickI18n(specs.performance?.os, lang) || "-"}
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
        <h2 className="text-2xl font-semibold mb-6">{t("productSpecs.supportTitle")}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(specs.support ?? []).map((text, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div className="w-1 h-1 bg-black rounded-full mt-2" />
              <span className="text-sm">{pickI18n(text, lang) || "-"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
