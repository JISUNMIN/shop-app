// app/order/_components/AddressSearchField.tsx
"use client";

import { useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

declare global {
  interface Window {
    daum?: any;
  }
}

type Props<TFormValues extends Record<string, any>> = {
  form: UseFormReturn<TFormValues>;
  name: keyof TFormValues;
  focusTo?: keyof TFormValues;
  placeholder?: string;
};

export function AddressSearchField<TFormValues extends Record<string, any>>({
  form,
  name,
  focusTo,
  placeholder,
}: Props<TFormValues>) {
  const { t } = useTranslation();

  useEffect(() => {
    const id = "daum-postcode-script";
    if (document.getElementById(id)) return;

    const script = document.createElement("script");
    script.id = id;
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const openPostcode = useCallback(() => {
    if (!window.daum?.Postcode) {
      alert(t("order.alert.postcodeLoading"));
      return;
    }

    const width = 500;
    const height = 600;

    const left = Math.max((window.innerWidth - width) / 2, 0);
    const top = Math.max((window.innerHeight - height) / 2, 0);

    new window.daum.Postcode({
      width,
      height,
      oncomplete: (data: any) => {
        const addr = data.roadAddress || data.jibunAddress || data.address || "";

        form.setValue(name as any, addr, {
          shouldValidate: true,
          shouldDirty: true,
        });

        if (focusTo) {
          setTimeout(() => form.setFocus(focusTo as any), 0);
        }
      },
    }).open({
      left,
      top,
    });
  }, [form, name, focusTo, t]);

  return (
    <div className="flex gap-2 mt-2">
      <Input
        className="flex-1"
        placeholder={placeholder ?? t("order.addressDialog.addressPlaceholder")}
        {...form.register(name as any)}
        readOnly
        onClick={openPostcode}
      />
      <Button variant="outline" type="button" onClick={openPostcode}>
        {t("order.common.search")}
      </Button>
    </div>
  );
}
