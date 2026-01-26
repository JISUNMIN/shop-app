"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
  const { t } = useTranslation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Button
          variant="outline"
        className="w-full mt-4 text-red-600 border-red-300 hover:bg-red-50"
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      <span className="hidden sm:inline">
        {isLoggingOut ? t("auth.loggingOut") : t("auth.logout")}
      </span>
    </Button>
  );
}