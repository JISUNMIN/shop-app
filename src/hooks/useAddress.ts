// src/hooks/useAddress.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Address } from "@/types";
import axiosSession from "@/lib/axiosSession";

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["address", "list"] }),
  });

  // 배송지 삭제
  const { mutateAsync: removeAddressMutate, isPending: isRemovePending } = useMutation<
    void,
    Error,
    { addressId: number }
  >({
    mutationFn: async ({ addressId }) => {
      await axiosSession.delete(`${ADDRESS_API_PATH}/${addressId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address", "list"] });
    },
  });

  return {
    // list
    listData,
    isListLoading,
    isListFetching,
    listError,
    // add
    addAddressMutate,
    isAddPending,
    // remove
    removeAddressMutate,
    isRemovePending,
  };
};

export default useAddress;
