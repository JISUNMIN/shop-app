"use client";

import { useTranslation } from "react-i18next";

export type TabKey = "detail" | "specs" | "guide" | "shipping";

export default function TabsNav({
  activeTab,
  onChange,
}: {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="border-b border-gray-200 mb-8">
      <div className="flex gap-8 overflow-x-auto">
        <TabButton
          label={t("product.productTabs.detail")}
          active={activeTab === "detail"}
          onClick={() => onChange("detail")}
        />
        <TabButton
          label={t("product.productTabs.specs")}
          active={activeTab === "specs"}
          onClick={() => onChange("specs")}
        />
        <TabButton
          label={t("product.productTabs.guide")}
          active={activeTab === "guide"}
          onClick={() => onChange("guide")}
        />
        <TabButton
          label={t("product.productTabs.shipping")}
          active={activeTab === "shipping"}
          onClick={() => onChange("shipping")}
        />
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "pb-4 px-2 font-medium transition-colors relative whitespace-nowrap",
        active ? "text-black" : "text-gray-500 hover:text-gray-700",
      ].join(" ")}
    >
      {label}
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
    </button>
  );
}
