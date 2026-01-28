// src/hooks/useWishlistedProduct.ts
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";
import axiosSession from "@/lib/axiosSession";

const WISHLISTED_PRODUCT_API_PATH = "/products/by-ids";

const useWishlistedProduct = (displayIds?: number[]) => {
  // 위시리스트 id로 product 목록 조회
  const {
    data: listData,
    isLoading: isListLoading,
    isFetching: isListFetching,
    error: listError,
  } = useQuery<Product[], Error>({
    queryKey: ["wishlist-products", displayIds],
    queryFn: async () => {
      const idsParam = displayIds?.join(",");
      const res = await axiosSession.get<{ items: Product[] }>(
        `${WISHLISTED_PRODUCT_API_PATH}?ids=${idsParam}`,
      );
      return res.data.items;
    },
    placeholderData: (prev) => prev,
  });

  return {
    // 목록
    listData,
    isListLoading,
    isListFetching,
    listError,
  };
};

export default useWishlistedProduct;
