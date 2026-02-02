import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosSession from "@/lib/axiosSession";
import { Order } from "@prisma/client";

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

const useOrder = () => {
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
  //   const getOrderDetail = (orderId: number) =>
  //     useQuery({
  //       queryKey: ["orders", "detail", orderId],
  //       queryFn: async () => {
  //         const res = await axiosSession.get(`${ORDER_API_PATH}/${orderId}`);
  //         return res.data;
  //       },
  //       enabled: !!orderId,
  //     });

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
    // getOrderDetail,
  };
};

export default useOrder;
