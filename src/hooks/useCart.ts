// src/hooks/useCart.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CartItem } from "@/types";
import axiosSession from "@/lib/axiosSession";
import { useTranslation } from "@/context/TranslationContext";

const CART_API_PATH = "/cart";

type AddToCartParams = { productId: string; quantity: number };
type UpdateCartParams = { itemId: string; quantity: number };

const useCart = () => {
  const queryClient = useQueryClient();
  const t = useTranslation();

  // 장바구니 목록 조회
  const {
    data: listData,
    isLoading: isListLoading,
    isFetching: isListFetching,
    error: listError,
  } = useQuery<CartItem[], Error>({
    queryKey: ["cart", "list"],
    queryFn: async () => {
      const res = await axiosSession.get<CartItem[]>(CART_API_PATH);
      return res.data;
    },
  });

  // 장바구니 추가
  const { mutateAsync: addToCartMutate, isPending: isAddPending } = useMutation<
    CartItem,
    Error,
    AddToCartParams
  >({
    mutationFn: async (data) => {
      const res = await axiosSession.post<CartItem>(CART_API_PATH, data);
      return res.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["cart", "list"] }),
    onError: () => toast.error(t.addToCartFail),
  });

  // 장바구니 수량 수정
  const { mutateAsync: updateCartItemMutate, isPending: isUpdatePending } =
    useMutation<CartItem, Error, UpdateCartParams>({
      mutationFn: async (data) => {
        const res = await axiosSession.patch<CartItem>(CART_API_PATH, data);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart", "list"] });
        toast.success(t.quantityChanged);
      },
      onError: () => toast.error(t.quantityChangeFail),
    });

  // 장바구니 삭제
  const { mutateAsync: removeFromCartMutate, isPending: isRemovePending } =
    useMutation<void, Error, { itemId: string; showToast?: boolean }>({
      mutationFn: async ({ itemId }) => {
        await axiosSession.delete(`${CART_API_PATH}?itemId=${itemId}`);
      },
      onSuccess: (_, variables) => {
        const { showToast = true } = variables;
        queryClient.invalidateQueries({ queryKey: ["cart", "list"] });
        if (showToast) toast.success(t.removedFromCart);
      },
      onError: () => toast.error(t.removeFail),
    });

  return {
    // list
    listData,
    isListLoading,
    isListFetching,
    listError,
    // add
    addToCartMutate,
    isAddPending,
    // update
    updateCartItemMutate,
    isUpdatePending,
    // remove
    removeFromCartMutate,
    isRemovePending,
  };
};

export default useCart;
