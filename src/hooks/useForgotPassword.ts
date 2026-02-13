// src/hooks/useForgotPassword.ts
import { useMutation } from "@tanstack/react-query";
import axiosSession from "@/lib/axiosSession";

const FORGOT_PASSWORD_API_PATH = "/auth/forgot-password";

export type ForgotPasswordRequest = {
  userId: string;
  phone: string;
};

export type ForgotPasswordResponse = {
  message?: string;
  success?: boolean;
};

const useForgotPassword = () => {
  const { mutateAsync: requestForgotPasswordAsync, isPending: isRequestForgotPasswordPending } = useMutation<
    ForgotPasswordResponse,
    unknown,
    ForgotPasswordRequest
  >({
    mutationFn: async (data) => {
      const res = await axiosSession.post<ForgotPasswordResponse>(
        FORGOT_PASSWORD_API_PATH,
        data,
      );
      return res.data;
    },
  });

  return {
    requestForgotPasswordAsync,
    isRequestForgotPasswordPending,
  };
};

export default useForgotPassword;
