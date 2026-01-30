// app/order/_components/dialogs/AddressCreateDialog.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { AddressSearchField } from "../AddressSearchField";
import { formatKoreanMobile } from "@/utils/helper";
import useAddress from "@/hooks/useAddress";
import { Address } from "@/types";

export type NewAddressFormValues = {
  label: string;
  name: string;
  phone: string;
  address1: string;
  address2: string;
  isDefault: boolean;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingAddress?: Address | null;
}

export function AddressCreateDialog({ open, onOpenChange, editingAddress }: Props) {
  const { t } = useTranslation();
  const { addAddressMutate, editAddressMutate } = useAddress();

  const schema = useMemo(
    () =>
      yup.object({
        label: yup.string().trim().required(t("order.validation.required")),
        name: yup.string().trim().required(t("order.validation.required")),
        phone: yup
          .string()
          .trim()
          .required(t("order.validation.required"))
          .matches(/^010-\d{4}-\d{4}$/, t("order.validation.phone")),
        address1: yup.string().trim().required(t("order.validation.required")),
        address2: yup.string().trim().default(""),
        isDefault: yup.boolean().default(false),
      }),
    [t],
  );

  const methods = useForm<NewAddressFormValues>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      label: "",
      name: "",
      phone: "",
      address1: "",
      address2: "",
      isDefault: false,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid, isSubmitting },
  } = methods;

  const submit = handleSubmit((data) => {
    if (editingAddress) {
      editAddressMutate({ id: editingAddress.id, ...data });
    } else {
      addAddressMutate(data);
    }

    onOpenChange(false);
  });

  useEffect(() => {
    if (!open) return;

    if (editingAddress) {
      reset({
        label: editingAddress.label ?? "",
        name: editingAddress.name ?? "",
        phone: editingAddress.phone ?? "",
        address1: editingAddress.address1 ?? "",
        address2: editingAddress.address2 ?? "",
        isDefault: !!editingAddress.isDefault,
      });
    } else {
      reset({
        label: "",
        name: "",
        phone: "",
        address1: "",
        address2: "",
        isDefault: false,
      });
    }
  }, [open, editingAddress, reset]);

  return (
    <FormProvider {...methods}>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          onOpenChange(next);
          if (!next) reset();
        }}
      >
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("order.addressDialog.title")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label>{t("order.addressDialog.name")} *</Label>
              <Input
                placeholder={t("order.addressDialog.namePlaceholder")}
                className="mt-2"
                {...register("label")}
              />
              {errors.name?.message && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label>{t("order.addressDialog.recipient")} *</Label>
              <Input
                placeholder={t("order.addressDialog.recipientPlaceholder")}
                className="mt-2"
                {...register("name")}
              />
              {errors.name?.message && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label>{t("order.addressDialog.phone")} *</Label>

              <Controller
                name="phone"
                control={methods.control}
                render={({ field }) => (
                  <Input
                    placeholder={t("order.addressDialog.phonePlaceholder")}
                    className="mt-2"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(formatKoreanMobile(e.target.value))}
                    inputMode="numeric"
                  />
                )}
              />

              {methods.formState.errors.phone?.message && (
                <p className="text-sm text-destructive mt-1">
                  {methods.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <Label>{t("order.addressDialog.address")} *</Label>
              <AddressSearchField<NewAddressFormValues>
                form={methods}
                name="address1"
                focusTo="address2"
                placeholder={t("order.addressDialog.addressPlaceholder")}
              />
              {errors.address1?.message && (
                <p className="text-sm text-destructive mt-1">{errors.address1.message}</p>
              )}
            </div>

            <div>
              <Label>{t("order.addressDialog.detailAddress")}</Label>
              <Input
                placeholder={t("order.addressDialog.detailAddressPlaceholder")}
                className="mt-2"
                {...register("address2")}
              />
              {errors.address2?.message && (
                <p className="text-sm text-destructive mt-1">{errors.address2.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Controller
                name="isDefault"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={(v) => field.onChange(!!v)}
                    id="new-default"
                  />
                )}
              />
              <Label htmlFor="new-default">{t("order.addressDialog.setDefault")}</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={submit} className="flex-1" disabled={!isValid || isSubmitting}>
                {t("order.addressDialog.add")}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  reset();
                }}
                className="flex-1"
              >
                {t("order.common.cancel")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
