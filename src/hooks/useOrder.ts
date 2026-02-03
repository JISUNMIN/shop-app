import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosSession from "@/lib/axiosSession";
import { Order } from "@prisma/client";
import { OrderItem } from "@/types";

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

  products: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
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

  // 주문 상세 조회
  const {
    data: detailData,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
  } = useQuery<OrderItem, Error>({
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

    // detail
    detailData,
    isDetailLoading,
    isDetailFetching,
  };
};

export default useOrder;
