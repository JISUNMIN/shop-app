// src/app/product/[productId]/_components/ProductDetailTabs/TabShipping.tsx
"use client";

import { RefreshCw, Shield, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Section } from "./parts";

export default function TabShipping() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-6 h-6" />
            <h2 className="text-2xl font-semibold">{t("productShipping.deliveryTitle")}</h2>
          </div>
          <div className="space-y-4 text-sm">
            <Section
              title={t("productShipping.deliveryPeriodTitle")}
              desc={t("productShipping.deliveryPeriodDesc")}
            />
            <Section
              title={t("productShipping.deliveryFeeTitle")}
              desc={t("productShipping.deliveryFeeDesc")}
            />
            <Section
              title={t("productShipping.trackTitle")}
              desc={t("productShipping.trackDesc")}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="w-6 h-6" />
            <h2 className="text-2xl font-semibold">{t("productShipping.returnTitle")}</h2>
          </div>

          <div className="space-y-4 text-sm">
            <Section
              title={t("productShipping.returnPeriodTitle")}
              desc={t("productShipping.returnPeriodDesc")}
            />

            <div>
              <h3 className="font-semibold mb-2">{t("productShipping.returnBlockTitle")}</h3>
              <ul className="text-gray-600 space-y-1 ml-4 list-disc">
                <li>{t("productShipping.returnBlock1")}</li>
                <li>{t("productShipping.returnBlock2")}</li>
                <li>{t("productShipping.returnBlock3")}</li>
                <li>{t("productShipping.returnBlock4")}</li>
              </ul>
            </div>

            <Section
              title={t("productShipping.processTitle")}
              desc={t("productShipping.processDesc")}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6" />
            <h2 className="text-2xl font-semibold">{t("productShipping.warrantyTitle")}</h2>
          </div>

          <div className="space-y-4 text-sm">
            <Section
              title={t("productShipping.warrantyPeriodTitle")}
              desc={t("productShipping.warrantyPeriodDesc")}
            />
            <Section
              title={t("productShipping.asCenterTitle")}
              desc={t("productShipping.asCenterDesc")}
            />
            <Section title={t("productShipping.csTitle")} desc={t("productShipping.csDesc")} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
