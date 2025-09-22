"use client";

import { useSearchParams, useRouter } from "next/navigation";
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
import { useTranslation } from "@/context/TranslationContext";
import { formatString } from "@/utils/helper";

const validSorts = [
  "newest",
  "oldest",
  "price_asc",
  "price_desc",
  "name",
] as const;
type SortType = (typeof validSorts)[number];

export default function ProductList() {
  const t = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchParam = searchParams.get("search") || "";
  const pageParam = parseInt(searchParams.get("page") || "1");
  const sortParam = searchParams.get("sort");
  const categoryParam = searchParams.get("category") || "";

  const sort: SortType = validSorts.includes(sortParam as SortType)
    ? (sortParam as SortType)
    : "newest";

  const currentParams = {
    search: searchParam,
    page: pageParam,
    sort,
    category: categoryParam,
  };

  const { listData, isListLoading, listError } = useProducts(currentParams);

  const updateURL = (newParams: Partial<typeof currentParams>) => {
    const params = new URLSearchParams();
    const updated = { ...currentParams, ...newParams };

    if (updated.search) params.set("search", updated.search);
    if (updated.page > 1) params.set("page", updated.page.toString());
    if (updated.sort !== "newest") params.set("sort", updated.sort);
    if (updated.category) params.set("category", updated.category);

    router.push(`/?${params.toString()}`);
  };

  const handleSortChange = (newSort: SortType) => {
    updateURL({ sort: newSort, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (listError) {
    return (
      <ErrorMessage
        message="상품을 불러올 수 없습니다."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="container py-8">
      {/* 헤더 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {currentParams.search
                ? formatString(t.searchResults, { query: currentParams.search })
                : t.allProducts}
            </h1>
            {listData && (
              <p className="text-muted-foreground">
                {formatString(t.totalProducts, {
                  total: listData.total,
                  page: listData.total === 0 ? 0 : listData.page,
                  totalPages: listData.totalPages,
                })}
              </p>
            )}
          </div>

          {/* 정렬 옵션 */}
          <Select value={currentParams.sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t.sortNewest}</SelectItem>
              <SelectItem value="oldest">{t.sortOldest}</SelectItem>
              <SelectItem value="price_asc">{t.sortPriceAsc}</SelectItem>
              <SelectItem value="price_desc">{t.sortPriceDesc}</SelectItem>
              <SelectItem value="name">{t.sortName}</SelectItem>
            </SelectContent>
          </Select>
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
          {listData.data.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-12"
        >
          <div className="text-center">
            <h2 className="text-xl font-semibold">상품이 없습니다</h2>
            <p className="mt-2 text-muted-foreground">
              {currentParams.search
                ? "다른 검색어로 시도해보세요."
                : "아직 등록된 상품이 없습니다."}
            </p>
            {currentParams.search && (
              <Button
                onClick={() => router.push("/")}
                className="mt-4 cursor-pointer"
              >
                전체 상품 보기
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
              {t.prev}
            </Button>

            {Array.from(
              { length: Math.min(5, listData.totalPages) },
              (_, i) => {
                const startPage = Math.max(1, currentParams.page - 2);
                const pageNumber = startPage + i;

                if (pageNumber > listData.totalPages) return null;

                return (
                  <Button
                    key={pageNumber}
                    variant={
                      currentParams.page === pageNumber ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              }
            )}

            <Button
              variant="outline"
              size="sm"
              disabled={currentParams.page >= listData.totalPages}
              onClick={() => handlePageChange(currentParams.page + 1)}
            >
              {t.next}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
