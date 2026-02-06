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
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useCategoriesStore } from "@/store/categoryStore";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const validSorts = ["newest", "oldest", "price_asc", "price_desc", "name"] as const;
type SortType = (typeof validSorts)[number];

export default function ProductList() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
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
      category: categoriesParam,
    };
  }, [searchParam, pageParam, categoriesParam, sort]);

  const { listData, isListLoading, listError } = useProducts(currentParams);

  const updateURL = useCallback(
    (newParams: Partial<typeof currentParams>) => {
      const params = new URLSearchParams();
      const updated = { ...currentParams, ...newParams };

      if (updated.search) params.set("search", updated.search);
      if (updated.page > 1) params.set("page", updated.page.toString());
      if (updated.sort !== "newest") params.set("sort", updated.sort);
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
      updateURL({ sort: newSort, page: 1 });
    },
    [updateURL],
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
    <div className="container py-8">
      {/* 헤더 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-gray-900">
              {currentParams.search
                ? t("searchResults", { query: currentParams.search })
                : t("allProducts")}
            </h1>
            {listData && (
              <p className="text-sm text-gray-500">
                {t("totalProducts", {
                  total: listData.total,
                  page: listData.total === 0 ? 0 : listData.page,
                  totalPages: listData.totalPages,
                })}
              </p>
            )}
          </div>
        </div>

        {/* 필터 & 정렬 */}
        <div className="mb-6 mt-4 rounded-2xl border border-gray-200 bg-white p-4 md:p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 min-w-0">
            <div className="text-sm text-gray-500">
              {selectedCategories.length === 0
                ? t("allProducts")
                : t("categoriesSelected", { count: selectedCategories.length })}
            </div>

            <div className="flex flex-wrap gap-2">
              {/* 전체 */}
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer select-none px-3 py-1.5",
                  selectedCategories.length === 0
                    ? "border-[color-mix(in_oklch,var(--button-bg)_30%,transparent)] text-[var(--button-bg)] bg-[color-mix(in_oklch,var(--button-bg)_10%,transparent)] hover:bg-[color-mix(in_oklch,var(--button-bg)_10%,transparent)]"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50",
                )}
                onClick={handleAllClick}
              >
                {t("all")}
              </Badge>

              {/* 카테고리 */}
              {categories.map((category) => {
                const label = lang.startsWith("ko") ? category.ko : category.en;
                const active = selectedCategories.includes(category.en);

                return (
                  <Badge
                    key={category.en}
                    variant="outline"
                    className={cn(
                      "cursor-pointer select-none px-3 py-1.5",
                      active
                        ? "border-[color-mix(in_oklch,var(--button-bg)_30%,transparent)] text-[var(--button-bg)] bg-[color-mix(in_oklch,var(--button-bg)_10%,transparent)] hover:bg-[color-mix(in_oklch,var(--button-bg)_10%,transparent)]"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50",
                    )}
                    onClick={() => handleCategoryToggle(category.en)}
                  >
                    {label}
                  </Badge>
                );
              })}

              {/* 리셋 */}
              <Badge
                variant="outline"
                className="cursor-pointer border-gray-200 text-gray-700 hover:bg-gray-50 px-3 py-1.5"
                onClick={handleReset}
                aria-label="초기화"
              >
                <RotateCcw className={cn("h-4 w-4", isResetAnimating && "animate-spin")} />
              </Badge>
            </div>
          </div>

          <div className="w-full md:w-auto md:shrink-0">
            <Select value={currentParams.sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full md:w-44 border-gray-200 focus:ring-1 focus:ring-[color-mix(in_oklch,var(--button-bg)_40%,transparent)]">
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
