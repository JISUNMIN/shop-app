// src/hooks/usePhoneVerification.ts

import axiosSession from "@/lib/axiosSession";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const SEND_PHONE_CODE_API_PATH = "/auth/sms/send";
const VERIFY_PHONE_CODE_API_PATH = "/auth/sms/verify";

export type SendPhoneCodePayload = {
  phone: string;
};

export type SendPhoneCodeResponse = {
  ok: boolean;
  expiresInSec?: number;
  code?: string;
  message?: string;
};

export type VerifyPhoneCodePayload = {
  phone: string;
  code: string;
};

export type VerifyPhoneCodeResponse = {
  ok: boolean;
  alreadyVerified?: boolean;
  message?: string;
};

const usePhoneVerification = () => {
  const { t } = useTranslation();

  const { mutateAsync: sendPhoneCodeMutate, isPending: isSendPhoneCodePending } = useMutation<
    SendPhoneCodeResponse,
    Error,
    SendPhoneCodePayload
  >({
    mutationFn: async (data) => {
      const res = await axiosSession.post<SendPhoneCodeResponse>(SEND_PHONE_CODE_API_PATH, data);
      return res.data;
    },
    onSuccess: (res) => {
      if (res?.ok) {
        toast.success(t("auth.mobileCodeSent"));
      } else {
        toast.error(res?.message ?? t("auth.mobileCodeSendFail"));
      }
    },
    onError: (err) => {
      toast.error(t("auth.mobileCodeSendFail"));
      console.error(err);
    },
  });

  const { mutateAsync: verifyPhoneCodeMutate, isPending: isVerifyPhoneCodePending } = useMutation<
    VerifyPhoneCodeResponse,
    Error,
    VerifyPhoneCodePayload
  >({
    mutationFn: async (data) => {
      const res = await axiosSession.post<VerifyPhoneCodeResponse>(
        VERIFY_PHONE_CODE_API_PATH,
        data
      );
      return res.data;
    },
    onSuccess: (res) => {
      if (res?.ok) {
        toast.success(t("auth.mobileVerified"));
      } else {
        toast.error(res?.message ?? t("auth.mobileVerifyFail"));
      }
    },
    onError: (err) => {
      toast.error(t("auth.mobileVerifyFail"));
      console.error(err);
    },
  });

  return {
    sendPhoneCodeMutate,
    isSendPhoneCodePending,
    verifyPhoneCodeMutate,
    isVerifyPhoneCodePending,
  };
};

export default usePhoneVerification;
