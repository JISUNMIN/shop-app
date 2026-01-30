// src/hooks/useAddress.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Address } from "@/types";
import axiosSession from "@/lib/axiosSession";

const ADDRESS_API_PATH = "/addresses";

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
    Address
  >({
    mutationFn: async (data) => {
      const res = await axiosSession.post<Address>(ADDRESS_API_PATH, data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["address", "list"] }),
  });

  // 배송지 수정
  const { mutate: editAddressMutate, isPending: isEditPending } = useMutation<void, Error, Address>(
    {
      mutationFn: async (data) => {
        const { id, ...rest } = data;
        await axiosSession.patch(`${ADDRESS_API_PATH}/${id}`, rest);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["address", "list"] });
      },
    },
  );

  // 배송지 삭제
  const { mutate: deleteAddressMutate, isPending: isDeletePending } = useMutation<
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
    // edit
    editAddressMutate,
    isEditPending,
    // remove
    deleteAddressMutate,
    isDeletePending,
  };
};

export default useAddress;
