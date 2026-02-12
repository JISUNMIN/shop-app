import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSession from "@/lib/axiosSession";

export type ClaimPayload = {
  id: number;
  cancelReason?: string;
  returnReason?: string;
};

const useOrderClaim = () => {
  const queryClient = useQueryClient();

  // 주문 상태 변경
  const { mutate: orderClaimMutate, isPending: isOrderClaimPending } = useMutation<
    ClaimPayload,
    Error,
    ClaimPayload
  >({
    mutationFn: async ({ id, ...payload }: ClaimPayload) => {
      const res = await axiosSession.post(`/orders/${id}/claim`, payload);
      return res.data;
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders", "list"] }),
        queryClient.invalidateQueries({ queryKey: ["orders", "detail", variables.id] }),
      ]);
    },
  });

  return {
    // changeStatus
    orderClaimMutate,
    isOrderClaimPending,
  };
};

export default useOrderClaim;
