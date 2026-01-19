// src/hooks/useSignup.ts

import axiosSession from "@/lib/axiosSession";
import type { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const SIGNUP_API_PATH = "/auth/signup";

type SignupPayload = {
  name?: string | null;
  email: string;
  password: string;
};

const useSignup = () => {
  const { t } = useTranslation();

  const { mutateAsync: signupMutate, isPending: isSignupPending } = useMutation<SignupPayload, Error, SignupPayload>({
    mutationFn: async (data) => {
      const res = await axiosSession.post<SignupPayload>(SIGNUP_API_PATH, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success(t("signup.success"));
    },
    onError: (err) => {
      toast.error(t("signup.fail"));
      console.error(err);
    },
  });

  return {
    signupMutate,
    isSignupPending,
  };
};

export default useSignup;
