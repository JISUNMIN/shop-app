// src/hooks/useAddress.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Address } from "@/types";
import axiosSession from "@/lib/axiosSession";
import { useTranslation } from "@/context/TranslationContext";

const ADDRESS_API_PATH = "/addresses";

type AddAddressParams = {
  label: string;
  name: string;
  phone: string;
  address1: string;
  address2?: string;
  isDefault: boolean;
  zip?: string;
  memo?: string;
};

type UpdateCartParams = { itemId: string; quantity: number };

const useAddress = () => {
  const queryClient = useQueryClient();

  // 배송지 목록 조회
  const {
    data: listData,
    isLoading: isListLoading,
    isFetching: isListFetching,
    error: listError,
  } = useQuery<Address[], Error>({
    queryKey: ["address", "list"],
    queryFn: async () => {
      const res = await axiosSession.get<Address[]>(ADDRESS_API_PATH);
      return res.data;
    },
  });

  // 배송지 추가
  const { mutateAsync: addAddressMutate, isPending: isAddPending } = useMutation<
    Address,
    Error,
    AddAddressParams
  >({
    mutationFn: async (data) => {
      const res = await axiosSession.post<Address>(ADDRESS_API_PATH, data);
      return res.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["address", "list"] }),
  });

//   배송지 수량 수정
//   const { mutateAsync: updateAddressMutate, isPending: isUpdatePending } =
//     useMutation<Address, Error, UpdateCartParams>({
//       mutationFn: async (data) => {
//         const res = await axiosSession.patch<Address>(ADDRESS_API_PATH, data);
//         return res.data;
//       },
//       onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey: ["cart", "list"] });
//         toast.success(t.quantityChanged);
//       },
//       onError: () => toast.error(t.quantityChangeFail),
//     });

//    배송지 삭제
//   const { mutateAsync: removeFromCartMutate, isPending: isRemovePending } =
//     useMutation<void, Error, { itemId: string; showToast?: boolean }>({
//       mutationFn: async ({ itemId }) => {
//         await axiosSession.delete(`${ADDRESS_API_PATH}?itemId=${itemId}`);
//       },
//       onSuccess: (_, variables) => {
//         const { showToast = true } = variables;
//         queryClient.invalidateQueries({ queryKey: ["cart", "list"] });
//         if (showToast) toast.success(t.removedFromCart);
//       },
//       onError: () => toast.error(t.removeFail),
//     });

  return {
    // list
    listData,
    isListLoading,
    isListFetching,
    listError,
    // add
    addAddressMutate,
    isAddPending,// // update
  };
};

export default useAddress;
