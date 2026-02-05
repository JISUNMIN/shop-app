// src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { Product, SearchParams, ApiResponse } from "@/types";
import axiosInstance from "@/lib/axiosSession";

const PRODUCTS_API_PATH = "/products";

type UseProductsOptions = {
  enableList?: boolean;
  enableDetail?: boolean;
};

const useProducts = (
  params?: SearchParams,
  targetId?: number,
  options: UseProductsOptions = {},
) => {
  const { enableList = true, enableDetail = true } = options;

  // 상품 목록 조회
  const {
    data: listData,
    isLoading: isListLoading,
    isFetching: isListFetching,
    error: listError,
  } = useQuery<ApiResponse<Product[]>, Error>({
    queryKey: ["products", "list", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set("search", params.search);
      if (params?.page) searchParams.set("page", params.page.toString());
      if (params?.sort) searchParams.set("sort", params.sort);
      if (params?.category) searchParams.set("category", params.category);

      const res = await axiosInstance.get<ApiResponse<Product[]>>(
        `${PRODUCTS_API_PATH}?${searchParams.toString()}`,
      );
      return res.data;
    },
    enabled: enableList,
  });

  // 상품 상세 조회
  const {
    data: detailData,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
    error: detailError,
  } = useQuery<Product, Error>({
    queryKey: ["products", "detail", targetId],
    queryFn: async () => {
      const res = await axiosInstance.get<Product>(`${PRODUCTS_API_PATH}/${targetId}`);
      return res.data;
    },
    enabled: enableDetail && !!targetId,
  });

  return {
    listData,
    isListLoading,
    isListFetching,
    listError,
    detailData,
    isDetailLoading,
    isDetailFetching,
    detailError,
  };
};

export default useProducts;
