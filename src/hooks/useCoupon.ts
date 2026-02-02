// src/hooks/useCoupon.ts
import { useQuery } from "@tanstack/react-query";
import { Coupon } from "@/types";
import axiosSession from "@/lib/axiosSession";

const CART_API_PATH = "/coupon";

export type UserCoupon = {
  id: number;
  name: string;
  discount: string;
  expiry: string;
  minOrder: number;
  expiresAt: string;
  coupon: Coupon;
  status: string;
};

const useCoupon = () => {
  // 쿠폰 목록 조회
  const {
    data: listData,
    isLoading: isListLoading,
    isFetching: isListFetching,
    error: listError,
  } = useQuery<UserCoupon[], Error>({
    queryKey: ["coupon", "list"],
    queryFn: async () => {
      const res = await axiosSession.get<UserCoupon[]>(CART_API_PATH);
      return res.data;
    },
  });

  return {
    // list
    listData,
    isListLoading,
    isListFetching,
    listError,
  };
};

export default useCoupon;
