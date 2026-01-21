"use client";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

export function LogoutButton() {
  const { t } = useTranslation();
  return <Button onClick={() => signOut({ callbackUrl: "/" })}>{t("auth.logout")}</Button>;
}
