// src/hooks/useSignup.ts

import axiosSession from "@/lib/axiosSession";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const SIGNUP_API_PATH = "/auth/signup";
const CHECK_USER_ID_API_PATH = "/auth/signup/check-userid";

type SignupPayload = {
  userId: string;
  password: string;
  name?: string | null;
  mobileNumber?: string | null;
  email?: string;
};

type CheckUserIdResponse = {
  ok: boolean;
  available: boolean;
  message?: string;
};

const useSignup = () => {
  const { t } = useTranslation();

  const { mutateAsync: signupMutate, isPending: isSignupPending } = useMutation<
    SignupPayload,
    Error,
    SignupPayload
  >({
    mutationFn: async (data) => {
      const res = await axiosSession.post<SignupPayload>(SIGNUP_API_PATH, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success(t("auth.signupSuccess"));
    },
    onError: (err) => {
      toast.error(t("auth.signupfail"));
      console.error(err);
    },
  });

  const { mutateAsync: checkUserIdMutate, isPending: isCheckUserIdPending } = useMutation<
    CheckUserIdResponse,
    Error,
    { userId: string }
  >({
    mutationFn: async ({ userId }) => {
      const res = await axiosSession.get<CheckUserIdResponse>(CHECK_USER_ID_API_PATH, {
        params: { userId },
      });
      return res.data;
    },
    onError: (err) => {
      console.error(err);
    },
  });
  return {
    // 회원가입
    signupMutate,
    isSignupPending,
    // 아이디 체크
    checkUserIdMutate,
    isCheckUserIdPending,
  };
};

export default useSignup;
