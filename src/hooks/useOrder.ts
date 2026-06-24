import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosSession from "@/lib/axiosSession";
import { Order, OrderStatus, UpdateOrderShippingPayload } from "@/types";

const ORDER_API_PATH = "/orders";

export type CreateOrderPayload = {
  shipName: string;
  shipPhone: string;
  shipZip?: string | null;
  shipAddress1: string;
  shipAddress2?: string | null;
  shipMemo?: string | null;

  totalAmount: number;
  discountAmount?: number;
  couponId?: number | null;
  paymentMethod?:string;

  products: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
};

export type UpdateOrderStatusPayload = {
  id: number;
  nextStatus: OrderStatus;
  note?: string | null;
};

const useOrder = (targetId?: number) => {
  const queryClient = useQueryClient();

  // 주문 목록 조회
  const {
    data: listData,
    isLoading: isListLoading,
    isFetching: isListFetching,
    refetch: refetchList,
  } = useQuery<Order[], Error>({
    queryKey: ["orders", "list"],
    queryFn: async () => {
      const res = await axiosSession.get(ORDER_API_PATH);
      return res.data;
    },
    enabled: !targetId,
  });

  // 주문 생성
  const { mutate: createOrderMutate, isPending: isCreateOrderPending } = useMutation<
    CreateOrderPayload,
    Error,
    CreateOrderPayload
  >({
    mutationKey: ["orders", "create"],
    mutationFn: async (payload: CreateOrderPayload) => {
      const res = await axiosSession.post(ORDER_API_PATH, payload);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders", "list"] });
    },
  });

  const { mutate: updateOrderStatusMutate, isPending: isUpdateOrderStatusPending } = useMutation<
    Order,
    Error,
    UpdateOrderStatusPayload
  >({
    mutationKey: ["orders", "update-status"],
    mutationFn: async ({ id, nextStatus, note }: UpdateOrderStatusPayload) => {
      const res = await axiosSession.patch(`${ORDER_API_PATH}/${id}`, { nextStatus, note });
      return res.data;
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders", "list"] }),
        queryClient.invalidateQueries({ queryKey: ["orders", "detail", variables.id] }),
      ]);
    },
  });

  const { mutate: updateOrderShippingMutate, isPending: isUpdateOrderShippingPending } =
    useMutation<Order, Error, UpdateOrderShippingPayload>({
      mutationKey: ["orders", "update-shipping"],
      mutationFn: async ({ id, carrier, trackingNumber }: UpdateOrderShippingPayload) => {
        const res = await axiosSession.patch(`${ORDER_API_PATH}/${id}`, {
          carrier,
          trackingNumber,
        });
        return res.data;
      },
      onSuccess: async (_data, variables) => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["orders", "list"] }),
          queryClient.invalidateQueries({ queryKey: ["orders", "detail", variables.id] }),
        ]);
      },
    });

  // 주문 상세 조회
  const {
    data: detailData,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
  } = useQuery<Order, Error>({
    queryKey: ["orders", "detail", targetId],
    queryFn: async () => {
      const res = await axiosSession.get(`${ORDER_API_PATH}/${targetId}`);
      return res.data;
    },
    enabled: !!targetId,
  });

  return {
    // list
    listData,
    isListLoading,
    isListFetching,
    refetchList,

    // create
    createOrderMutate,
    isCreateOrderPending,
    updateOrderStatusMutate,
    isUpdateOrderStatusPending,
    updateOrderShippingMutate,
    isUpdateOrderShippingPending,

    // detail
    detailData,
    isDetailLoading,
    isDetailFetching,
  };
};

export default useOrder;
