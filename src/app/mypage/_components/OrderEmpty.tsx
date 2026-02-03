"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { PackageOpen } from "lucide-react";

export default function OrderEmpty() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Card className="p-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-2xl shadow-sm">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow mb-6">
        <PackageOpen className="w-8 h-8 text-gray-400" />
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-2">
        {t("mypage.orders.empty")}
      </h2>

      <p className="text-sm text-gray-500 mb-6 whitespace-pre-line">
        {t("mypage.orders.emptyDesc")}
      </p>

      <Button
        onClick={() => router.push("/")}
        className="rounded-xl px-6"
      >
        {t("mypage.orders.goShopping")}
      </Button>
    </Card>
  );
}
