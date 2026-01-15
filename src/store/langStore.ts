import { create } from "zustand";
import { persist } from "zustand/middleware";

type Lang = "ko" | "en";

interface LangState {
  lang: Lang;
  toggleLang: () => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      lang: "ko",
      toggleLang: () => set({ lang: get().lang === "ko" ? "en" : "ko" }),
    }),
    {
      name: "lang",
    }
  )
);
