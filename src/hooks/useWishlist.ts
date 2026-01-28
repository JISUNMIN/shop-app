// src/hooks/useWishlist.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Wishlist } from "@/types";
import axiosSession from "@/lib/axiosSession";

const WISHLIST_API_PATH = "/wishlist";

type WishlistIdsResponse = { productIds: number[] };

const useWishlist = (enabled: boolean = true) => {
  const queryClient = useQueryClient();

  // 위시리스트 id 조회
  const {
    data: listData,
    isLoading: isListLoading,
    isFetching: isListFetching,
    error: listError,
  } = useQuery<WishlistIdsResponse, Error>({
    queryKey: ["wishlist", "list"],
    queryFn: async () => {
      const res = await axiosSession.get<WishlistIdsResponse>(WISHLIST_API_PATH);
      return res.data;
    },
    enabled: enabled,
  });

  const productIds = listData?.productIds ?? [];

  // 위시리스트 추가
  const { mutate: addWishlistMutate, isPending: isAddPending } = useMutation<
    Wishlist,
    Error,
    { productId: number }
  >({
    mutationFn: async (data) => {
      const res = await axiosSession.post<Wishlist>(WISHLIST_API_PATH, data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist", "list"] }),
  });

  // 위시리스트 삭제
  const { mutateAsync: deleteWishlistMutate, isPending: isRemovePending } = useMutation<
    void,
    Error,
    { productId: number }
  >({
    mutationFn: async ({ productId }) => {
      await axiosSession.delete(`${WISHLIST_API_PATH}/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", "list"] });
    },
  });

  return {
    // list
    productIds,
    listData,
    isListLoading,
    isListFetching,
    listError,
    // add
    addWishlistMutate,
    isAddPending,
    // delete
    deleteWishlistMutate,
    isRemovePending,
  };
};

export default useWishlist;
