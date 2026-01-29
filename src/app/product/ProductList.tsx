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
import { formatString } from "@/utils/helper";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useCategoriesStore } from "@/store/categoryStore";
import { RotateCcw } from "lucide-react";

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
        // categories가 비면 파라미터 제거되게 "" 처리
        category: next.length > 0 ? next.join(",") : "",
      });
    },
    [selectedCategories, updateURL],
  );

  const handleAllClick = useCallback(() => {
    updateURL({ page: 1, category: "" });
  }, [updateURL]);

  const handleSortChange = useCallback(
    (newSort: SortType) => {
      updateURL({ sort: newSort, page: 1 });
    },
    [updateURL],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateURL({ page });
      // window.scrollTo({ top: 0, behavior: "smooth" });
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
      {/* 헤더 섹션 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl mb-2">
              {currentParams.search
                ? formatString(t("searchResults"), { query: currentParams.search })
                : t("allProducts")}
            </h1>
            {listData && (
              <p className="text-sm text-muted-foreground">
                {formatString(t("totalProducts"), {
                  total: listData.total,
                  page: listData.total === 0 ? 0 : listData.page,
                  totalPages: listData.totalPages,
                })}
              </p>
            )}
          </div>
        </div>

        {/* 필터 및 정렬 */}
        <div
          className="
              mb-6 mt-4 rounded-lg shadow-md bg-white p-4
              flex flex-col gap-4
              md:flex-row md:items-center md:justify-between
            "
        >
          {/* 왼쪽: 카테고리 칩 + 상태 텍스트 */}
          <div className="flex flex-col gap-2 min-w-0">
            {/* 상태 표시 */}
            <div className="text-sm text-gray-500">
              {selectedCategories.length === 0
                ? t("allProducts")
                : t("categoriesSelected", { count: selectedCategories.length })}
            </div>

            <div className="flex flex-wrap gap-2">
              {/* 전체 */}
              <Badge
                variant={selectedCategories.length === 0 ? "default" : "outline"}
                className="cursor-pointer hover:bg-gray-100"
                onClick={handleAllClick}
              >
                {t("all")}
              </Badge>

              {/* 카테고리 멀티 선택 */}
              {categories.map((category) => {
                const label = lang.startsWith("ko") ? category.ko : category.en;
                const active = selectedCategories.includes(category.en);

                return (
                  <Badge
                    key={category.en}
                    variant={active ? "default" : "outline"}
                    className="cursor-pointer hover:bg-gray-100 px-2 py-2"
                    onClick={() => handleCategoryToggle(category.en)}
                  >
                    {label}
                  </Badge>
                );
              })}

              {/* 리셋 버튼 */}
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => {
                  setIsResetAnimating(true);
                  handleAllClick();
                  setTimeout(() => setIsResetAnimating(false), 400);
                }}
                aria-label="초기화"
              >
                <RotateCcw className={`${isResetAnimating ? "animate-spin" : ""}`} />
              </Badge>
            </div>
          </div>

          {/* 정렬 옵션 */}
          <div className="w-full md:w-auto md:shrink-0">
            <Select value={currentParams.sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full md:w-40">
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

      {/* 상품 그리드 */}
      {isListLoading ? (
        <ProductGridSkeleton />
      ) : listData && listData.data.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        >
          {listData.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-12"
        >
          <div className="text-center">
            <h2 className="text-xl font-semibold">{t("noProducts")}</h2>
            <p className="mt-2 text-muted-foreground">
              {currentParams.search ? t("noProductsSearch") : t("noProductsDefault")}
            </p>
            {currentParams.search && (
              <Button onClick={() => router.push("/")} className="mt-4 cursor-pointer">
                {t("viewAllProducts")}
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* 페이지네이션 */}
      {listData && listData.data.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
