"use client";

import type { AxiosError } from "axios";
import { useEffect, useEffectEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import axiosSession from "@/lib/axiosSession";
import type { OperatorOrdersDashboard, Order, OrderPriority, OrderStatus } from "@/types";

type UseOpsOrdersParams = {
  status: "all" | OrderStatus;
  search: string;
  autoRefresh: boolean;
};

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
const OPS_ORDER_STREAM_API_PATH = "/ops/orders/stream";

const useOpsOrders = ({ status, search, autoRefresh }: UseOpsOrdersParams) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [streamState, setStreamState] = useState<"idle" | "connecting" | "live" | "error">(
    autoRefresh ? "connecting" : "idle",
  );

  const dashboardQuery = useQuery<OperatorOrdersDashboard, Error>({
    queryKey: ["ops-orders", status, search],
    queryFn: async () => {
      const res = await axiosSession.get(OPS_ORDER_API_PATH, {
        params: {
          status,
          search: search || undefined,
        },
      });
      return res.data;
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  const handleStreamOpen = useEffectEvent(() => {
    setStreamState("live");
  });

  const handleStreamMessage = useEffectEvent(() => {
    setStreamState("live");
    void queryClient.invalidateQueries({ queryKey: ["ops-orders"] });
  });

  const handleStreamError = useEffectEvent(() => {
    setStreamState("error");
  });

  useEffect(() => {
    if (!autoRefresh) {
      setStreamState("idle");
      return;
    }

    setStreamState("connecting");
    const url = new URL(OPS_ORDER_STREAM_API_PATH, window.location.origin);
    url.searchParams.set("status", status);
    if (search) {
      url.searchParams.set("search", search);
    }

    const eventSource = new EventSource(url.toString(), { withCredentials: true });
    eventSource.addEventListener("open", handleStreamOpen);
    eventSource.addEventListener("ready", handleStreamOpen);
    eventSource.addEventListener("dashboard-update", handleStreamMessage);
    eventSource.addEventListener("stream-error", handleStreamError);
    eventSource.onerror = () => {
      handleStreamError();
    };

    return () => {
      eventSource.close();
    };
  }, [autoRefresh, handleStreamError, handleStreamMessage, handleStreamOpen, search, status]);

  const updateOrderMutation = useMutation<
    Order,
    AxiosError<{ error?: string }>,
    UpdateOpsOrderPayload
  >({
    mutationKey: ["ops-orders", "update"],
    mutationFn: async ({ id, ...payload }) => {
      const res = await axiosSession.patch(`${OPS_ORDER_API_PATH}/${id}`, payload);
      return res.data;
    },
    onSuccess: async () => {
      toast.success(t("opsOrders.toastUpdated"));
      await queryClient.invalidateQueries({ queryKey: ["ops-orders"] });
      await queryClient.invalidateQueries({ queryKey: ["orders", "detail"] });
      await queryClient.invalidateQueries({ queryKey: ["orders", "list"] });
    },
    onError: (error: AxiosError<{ error?: string }>) => {
      toast.error(error.response?.data?.error ?? t("opsOrders.toastUpdateFailed"));
    },
  });

  return {
    dashboardData: dashboardQuery.data,
    isDashboardLoading: dashboardQuery.isLoading,
    isDashboardFetching: dashboardQuery.isFetching,
    refetchDashboard: dashboardQuery.refetch,
    streamState,
    updateOpsOrderMutate: updateOrderMutation.mutate,
    isUpdateOpsOrderPending: updateOrderMutation.isPending,
  };
};

export default useOpsOrders;
