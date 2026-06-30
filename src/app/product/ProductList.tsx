"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import useProducts from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "./ProductSkeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import ErrorMessage from "@/components/ErrorMessage";
import { useTranslation } from "react-i18next";
import { useCategoriesStore } from "@/store/categoryStore";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { LangCode } from "@/types";

const validSorts = ["newest", "oldest", "price_asc", "price_desc", "name"] as const;
type SortType = (typeof validSorts)[number];

export default function ProductList() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as LangCode;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, fetchCategories } = useCategoriesStore();
  const [isResetAnimating, setIsResetAnimating] = useState(false);

  const searchParam = searchParams.get("search") || "";
  const pageParam = parseInt(searchParams.get("page") || "1");
  const sortParam = searchParams.get("sort");
  const categoriesParam = searchParams.get("category") || "";

  const selectedCategories = useMemo(() => {
    return categoriesParam ? categoriesParam.split(",").filter(Boolean) : [];
  }, [categoriesParam]);

  const sort: SortType = validSorts.includes(sortParam as SortType)
    ? (sortParam as SortType)
    : "newest";

  const currentParams = useMemo(() => {
    return {
      search: searchParam,
      page: pageParam,
      sort,
      locale: lang as LangCode,
      category: categoriesParam,
    };
  }, [searchParam, pageParam, categoriesParam, sort, lang]);

  const { listData, isListLoading, listError } = useProducts(currentParams);
  const availableCategoryCount = categories.length;

  const updateURL = useCallback(
    (newParams: Partial<typeof currentParams>) => {
      const params = new URLSearchParams();
      const updated = { ...currentParams, ...newParams };

      if (updated.search) params.set("search", updated.search);
      if (updated.page > 1) params.set("page", updated.page.toString());
      if (updated.sort !== "newest") params.set("sort", updated.sort);
      if (updated.sort === "name" && updated.locale) {
        params.set("locale", updated.locale);
      }
      if (updated.category) params.set("category", updated.category);

      router.replace(`/?${params.toString()}`, { scroll: false });
    },
    [currentParams, router],
  );

  const handleCategoryToggle = useCallback(
    (categoryEn: string) => {
      const next = selectedCategories.includes(categoryEn)
        ? selectedCategories.filter((c) => c !== categoryEn)
        : [...selectedCategories, categoryEn];

      updateURL({
        page: 1,
        category: next.length > 0 ? next.join(",") : "",
      });
    },
    [selectedCategories, updateURL],
  );

  const handleAllClick = useCallback(() => {
    updateURL({ page: 1, category: "" });
  }, [updateURL]);

  const handleReset = useCallback(() => {
    setIsResetAnimating(true);
    handleAllClick();
    setTimeout(() => setIsResetAnimating(false), 400);
  }, [handleAllClick]);

  const handleSortChange = useCallback(
    (newSort: SortType) => {
      updateURL({
        sort: newSort,
        page: 1,
        locale: newSort === "name" ? lang : undefined,
      });
    },
    [updateURL, lang],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateURL({ page });
    },
    [updateURL],
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (listError) {
    return <ErrorMessage message={t("errorLoading")} onRetry={() => window.location.reload()} />;
  }

  return (
    <div id="product-catalog" className="w-full scroll-mt-28 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="mb-8 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-[linear-gradient(135deg,#f8fbff_0%,#eef5fb_100%)] px-5 py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--link-accent)]">
                  Product Catalog
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <h2 className="text-[1.375rem] font-black tracking-[-0.03em] text-slate-950">
                    {t("productCollection.catalogTitle")}
                  </h2>
                  {listData && (
                    <span className="text-sm text-slate-400">
                      {t("productCollection.catalogCount", { count: listData.total })}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {currentParams.search
                    ? t("searchResults", { query: currentParams.search })
                    : selectedCategories.length > 0
                      ? t("categoriesSelected", { count: selectedCategories.length })
                      : t("productCollection.catalogDescription")}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
                  카테고리 {availableCategoryCount}개
                </div>
                <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
                  정렬 {t(`sort${currentParams.sort === "price_asc" ? "PriceAsc" : currentParams.sort === "price_desc" ? "PriceDesc" : currentParams.sort === "oldest" ? "Oldest" : currentParams.sort === "name" ? "Name" : "Newest"}`)}
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-5">
            <div>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={cn(
                      "cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors",
                      selectedCategories.length === 0
                        ? "border-[color-mix(in_oklch,var(--button-bg)_30%,transparent)] bg-[color-mix(in_oklch,var(--button-bg)_10%,transparent)] text-[var(--button-bg)] hover:bg-[color-mix(in_oklch,var(--button-bg)_10%,transparent)]"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50",
                    )}
                    onClick={handleAllClick}
                  >
                    {t("all")}
                  </button>

                  {categories.map((category) => {
                    const label = lang.startsWith("ko") ? category.ko : category.en;
                    const active = selectedCategories.includes(category.en);

                    return (
                      <button
                        key={category.en}
                        type="button"
                        className={cn(
                          "cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors",
                          active
                            ? "border-[color-mix(in_oklch,var(--button-bg)_30%,transparent)] bg-[color-mix(in_oklch,var(--button-bg)_10%,transparent)] text-[var(--button-bg)] hover:bg-[color-mix(in_oklch,var(--button-bg)_10%,transparent)]"
                            : "border-gray-200 text-gray-700 hover:bg-gray-50",
                        )}
                        onClick={() => handleCategoryToggle(category.en)}
                      >
                        {label}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className="cursor-pointer rounded-full border border-gray-200 px-3 py-1.5 text-gray-700 transition-colors hover:bg-gray-50"
                    onClick={handleReset}
                    aria-label="초기화"
                  >
                    <RotateCcw className={cn("h-4 w-4", isResetAnimating && "animate-spin")} />
                  </button>
                </div>

                <div className="w-full md:w-auto md:shrink-0">
                  <Select value={currentParams.sort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full rounded-full border-gray-200 bg-white md:w-48 focus:ring-1 focus:ring-[color-mix(in_oklch,var(--button-bg)_40%,transparent)]">
                      <SelectValue placeholder={t("sortPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">{t("sortNewest")}</SelectItem>
                      <SelectItem value="oldest">{t("sortOldest")}</SelectItem>
                      <SelectItem value="price_asc">{t("sortPriceAsc")}</SelectItem>
                      <SelectItem value="price_desc">{t("sortPriceDesc")}</SelectItem>
                      <SelectItem value="name">{t("sortName")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 상품 리스트 */}
      {isListLoading ? (
        <ProductGridSkeleton />
      ) : listData && listData.data.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        >
          {listData.data.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="will-change-transform"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">{t("noProducts")}</h2>
            <p className="mt-2 text-gray-500">
              {currentParams.search ? t("noProductsSearch") : t("noProductsDefault")}
            </p>

            {currentParams.search && (
              <Button onClick={() => router.push("/")} className="mt-4">
                {t("viewAllProducts")}
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* 페이지네이션 */}
      {listData && listData.data.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex justify-center"
        >
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentParams.page <= 1}
              onClick={() => handlePageChange(currentParams.page - 1)}
            >
              {t("prev")}
            </Button>

            {Array.from({ length: Math.min(5, listData.totalPages) }, (_, i) => {
              const startPage = Math.max(1, currentParams.page - 2);
              const pageNumber = startPage + i;

              if (pageNumber > listData.totalPages) return null;

              return (
                <Button
                  key={pageNumber}
                  variant={currentParams.page === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              disabled={currentParams.page >= listData.totalPages}
              onClick={() => handlePageChange(currentParams.page + 1)}
            >
              {t("next")}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
