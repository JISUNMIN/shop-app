// src/context/TranslationContext.tsx
"use client";
import { createContext, useContext, ReactNode, useMemo } from "react";
import { useLangStore } from "@/store/langStore";
import en from "@/i18n/en.json";
import ko from "@/i18n/ko.json";

export const TranslationContext = createContext(en);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const { lang } = useLangStore();
  const t = useMemo(() => (lang === "ko" ? ko : en), [lang]);

  return (
    <TranslationContext.Provider value={t}>
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => useContext(TranslationContext);
