"use client";

import Image from "next/image";
import { Camera, Mic, Smartphone, Speaker } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FeatureCard, InfoRow } from "./parts";
import type { DetailInfo, FeatureItem, Product } from "@/types";
import { pickI18n } from "@/utils/helper";

function iconNode(icon?: FeatureItem["icon"]) {
  switch (icon) {
    case "smartphone":
      return <Smartphone className="w-6 h-6" />;
    case "mic":
      return <Mic className="w-6 h-6" />;
    case "camera":
      return <Camera className="w-6 h-6" />;
    case "speaker":
      return <Speaker className="w-6 h-6" />;
    default:
      return <Smartphone className="w-6 h-6" />;
  }
}

export default function TabDetail({ product }: { product: Product }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const productName = pickI18n((product as any).name, lang);
  const features = ((product as any).features?.items ?? []) as FeatureItem[];
  const detailInfo = ((product as any).detailInfo ?? {}) as DetailInfo;

  return (
    <div className="space-y-8">
      {/* 이미지 */}
      <div className="space-y-4">
        {(product.images ?? []).map((img, index) => (
          <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
            <Image
              src={img}
              alt={`${productName} - ${t("product.productTabs.detail")} ${index + 1}`}
              width={1200}
              height={800}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        ))}
      </div>

      {/* 주요 특징 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl font-semibold mb-6">{t("productDetail.featuresTitle")}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f, idx) => (
            <FeatureCard
              key={idx}
              icon={iconNode(f.icon)}
              iconWrapClassName={
                idx % 4 === 0
                  ? "bg-blue-100 text-blue-600"
                  : idx % 4 === 1
                    ? "bg-green-100 text-green-600"
                    : idx % 4 === 2
                      ? "bg-purple-100 text-purple-600"
                      : "bg-orange-100 text-orange-600"
              }
              title={pickI18n(f.title, lang)}
              desc={pickI18n(f.desc, lang)}
            />
          ))}
        </div>
      </div>

      {/* 제품 정보*/}
      <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
        <h2 className="text-2xl font-semibold mb-6">{t("productDetail.infoTitle")}</h2>

        <div className="space-y-4 text-sm">
          <InfoRow label={t("productDetail.maker")} value={detailInfo.maker ?? "-"} />
          <InfoRow
            label={t("productDetail.origin")}
            value={pickI18n(detailInfo.origin, lang) || "-"}
          />
          <InfoRow
            label={t("productDetail.warranty")}
            value={pickI18n(detailInfo.warranty, lang) || "-"}
          />
          <InfoRow label={t("productDetail.as")} value={pickI18n(detailInfo.as, lang) || "-"} />
          <InfoRow label={t("productDetail.cert")} value={detailInfo.cert ?? "-"} />
        </div>
      </div>
    </div>
  );
}
