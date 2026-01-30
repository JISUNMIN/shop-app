import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import { formatKoreanMobile } from "@/utils/helper";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import useChangePassword from "@/hooks/useChangePassword";
import { Separator } from "@/components/ui/separator";

type PasswordChangeForm = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

export default function ProfileTab() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const user = session?.user;
  const isCredentialsUser = user?.provider === "credentials";
  const { changePasswordMutate, isChangePending } = useChangePassword();

  const schema = useMemo(
    () =>
      yup
        .object({
          currentPassword: yup
            .string()
            .required(t("auth.validation.passwordRequired"))
            .min(8, t("auth.passwordPlaceholder")),
          newPassword: yup
            .string()
            .required(t("auth.validation.passwordRequired"))
            .min(8, t("auth.passwordPlaceholder")),
          newPasswordConfirm: yup
            .string()
            .required(t("auth.validation.passwordConfirmRequired"))
            .min(8, t("auth.passwordPlaceholder"))
            .oneOf([yup.ref("newPassword")], t("auth.validation.passwordMismatch")),
        })
        .required(),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeForm>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  const onSubmit = (data: PasswordChangeForm) => {
    changePasswordMutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{t("mypage.tabs.profile")}</h1>

      <div className="space-y-10 ">
        <div className="max-w-xl space-y-6">
          <div>
            <Label>{t("auth.userId")}</Label>
            <Input defaultValue={user?.userId ?? "-"} className="mt-2" disabled />
          </div>

          <div>
            <Label>{t("auth.name")}</Label>
            <Input defaultValue={user?.name ?? "-"} className="mt-2" disabled />
          </div>

          <div>
            <Label>{t("auth.email")}</Label>
            <Input defaultValue={user?.email ?? "-"} type="email" className="mt-2" disabled />
          </div>

          <div>
            <Label>{t("auth.phone")}</Label>
            <Input
              defaultValue={formatKoreanMobile(user?.phone) ?? "-"}
              className="mt-2"
              disabled
            />
          </div>
        </div>

        {/* 비밀번호 변경 */}
        {isCredentialsUser ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <Separator className="my-8" />
            <h2 className="text-xl font-bold">{t("mypage.password.title")}</h2>
            <p className="text-gray-600 mb-6">{t("mypage.password.description")}</p>

            <div className="max-w-lg">
              <div className="space-y-6">
                {/* 현재 비밀번호 */}
                <div>
                  <Label>{t("mypage.password.currentPasswordLabel")}</Label>
                  <Input
                    type="password"
                    className="mt-2"
                    placeholder={t("mypage.password.currentPasswordPlaceholder")}
                    {...register("currentPassword")}
                  />
                  <p className="text-sm text-gray-500 mt-1">{t("mypage.password.passwordHint")}</p>
                  {errors.currentPassword?.message && (
                    <p className="text-sm text-red-600 mt-1">{errors.currentPassword.message}</p>
                  )}
                </div>

                {/* 새 비밀번호 */}
                <div>
                  <Label>{t("mypage.password.newPasswordLabel")}</Label>
                  <Input
                    type="password"
                    className="mt-2"
                    placeholder={t("mypage.password.newPasswordPlaceholder")}
                    {...register("newPassword")}
                  />
                  {errors.newPassword?.message && (
                    <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>
                  )}
                </div>

                {/* 새 비밀번호 확인 */}
                <div>
                  <Label>{t("mypage.password.newPasswordConfirmLabel")}</Label>
                  <Input
                    type="password"
                    className="mt-2"
                    placeholder={t("mypage.password.newPasswordConfirmPlaceholder")}
                    {...register("newPasswordConfirm")}
                  />
                  {errors.newPasswordConfirm?.message && (
                    <p className="text-sm text-red-600 mt-1">{errors.newPasswordConfirm.message}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4 ">
                  <Button className="flex-1" type="submit" disabled={isChangePending}>
                    <Lock className="w-4 h-4 mr-2" />
                    {isChangePending
                      ? t("mypage.password.submittingButton")
                      : t("mypage.password.submitButton")}
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1"
                    type="button"
                    onClick={handleReset}
                    disabled={isChangePending}
                  >
                    {t("mypage.password.cancelButton")}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="rounded-lg border p-4 text-sm text-gray-600 ">
            {t("mypage.password.snsNotAvailable")}
          </div>
        )}
      </div>
    </div>
  );
}
