// src/hooks/useChangePassword.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosSession from "@/lib/axiosSession";
import { useTranslation } from "react-i18next";

const PASSWORD_API_PATH = "/me/password";

export type ChangePasswordParams = {
  currentPassword: string;
  newPassword: string;
};

type ChangePasswordResponse = {
  message?: string;
};

const useChangePassword = () => {
  const { t } = useTranslation();

  const { mutate: changePasswordMutate, isPending: isChangePending } = useMutation<
    ChangePasswordResponse,
    Error,
    ChangePasswordParams
  >({
    mutationFn: async (data) => {
      const res = await axiosSession.patch<ChangePasswordResponse>(PASSWORD_API_PATH, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success(t("mypage.password.changeSuccess"));
    },
    onError: (err: any) => {
      const errorKey = err?.response?.data?.errorKey ?? "mypage.password.serverError.serverFail";
      toast.error(t(errorKey));
    },
  });

  return {
    changePasswordMutate,
    isChangePending,
  };
};

export default useChangePassword;
