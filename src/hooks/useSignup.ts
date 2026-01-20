// src/hooks/useSignup.ts

import axiosSession from "@/lib/axiosSession";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const SIGNUP_API_PATH = "/auth/signup";

type SignupPayload = {
  userId: string;
  password: string;
  name?: string | null;
  mobileNumber?: string | null;
  email?: string;
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

  return {
    signupMutate,
    isSignupPending,
  };
};

export default useSignup;
