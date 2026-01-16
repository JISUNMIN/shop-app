"use client";
import { ReactNode, useEffect } from "react";
import i18n from "@/i18n/i18n";
import { useLangStore } from "@/store/langStore";

export default function I18nProvider({ children }: { children: ReactNode }) {
  const { lang } = useLangStore();

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return <>{children}</>;
}
