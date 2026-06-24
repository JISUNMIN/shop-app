"use client";

import type { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import axiosSession from "@/lib/axiosSession";
import type { OperatorOrderDetail, Order, OrderPriority, OrderStatus } from "@/types";

type UpdateOpsOrderPayload = {
  id: number;
  nextStatus?: OrderStatus;
  carrier?: string | null;
  trackingNumber?: string | null;
  note?: string | null;
  assignedOperator?: string | null;
  priority?: OrderPriority;
  slaDueAt?: string | null;
  internalMemo?: string | null;
};

const OPS_ORDER_API_PATH = "/ops/orders";

const useOpsOrderDetail = (orderId: number) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const detailQuery = useQuery<OperatorOrderDetail, Error>({
    queryKey: ["ops-order-detail", orderId],
    queryFn: async () => {
      const res = await axiosSession.get(`${OPS_ORDER_API_PATH}/${orderId}`);
      return res.data;
    },
    enabled: Number.isFinite(orderId) && orderId > 0,
  });

  const updateMutation = useMutation<
    Order,
    AxiosError<{ error?: string }>,
    UpdateOpsOrderPayload
  >({
    mutationKey: ["ops-order-detail", "update"],
    mutationFn: async ({ id, ...payload }) => {
      const res = await axiosSession.patch(`${OPS_ORDER_API_PATH}/${id}`, payload);
      return res.data;
    },
    onSuccess: async () => {
      toast.success(t("opsOrderDetail.toastUpdated"));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["ops-order-detail", orderId] }),
        queryClient.invalidateQueries({ queryKey: ["ops-orders"] }),
        queryClient.invalidateQueries({ queryKey: ["orders", "detail"] }),
        queryClient.invalidateQueries({ queryKey: ["orders", "list"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error ?? t("opsOrderDetail.toastUpdateFailed"));
    },
  });

  return {
    detailData: detailQuery.data,
    isDetailLoading: detailQuery.isLoading,
    isDetailFetching: detailQuery.isFetching,
    refetchDetail: detailQuery.refetch,
    updateOpsOrderDetailMutate: updateMutation.mutate,
    isUpdateOpsOrderDetailPending: updateMutation.isPending,
  };
};

export default useOpsOrderDetail;
