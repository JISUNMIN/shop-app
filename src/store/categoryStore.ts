import axiosInstance from "@/lib/axiosSession";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CategoryText = { en: string; ko: string };

type CategoriesState = {
  categories: CategoryText[];
  isLoading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
  resetCategories: () => void;
};

export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set, get) => ({
      categories: [],
      isLoading: false,
      error: null,

      fetchCategories: async () => {
        if (get().categories.length > 0 || get().isLoading) return;

        set({ isLoading: true, error: null });

        try {
          const { data } = await axiosInstance.get<{ categories: CategoryText[] }>("/categories");

          set({
            categories: data?.categories ?? [],
            isLoading: false,
          });
        } catch (e) {
          set({
            error: e instanceof Error ? e.message : "Unknown error",
            isLoading: false,
          });
        }
      },

      resetCategories: () => {
        set({ categories: [], isLoading: false, error: null });
      },
    }),
    {
      name: "categories-store",
    },
  ),
);
