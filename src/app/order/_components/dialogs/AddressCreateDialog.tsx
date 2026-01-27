// app/order/_components/dialogs/AddressCreateDialog.tsx
"use client";

import { useTranslation } from "react-i18next";
import { FormProvider, useForm, Controller } from "react-hook-form";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export type NewAddressFormValues = {
  name: string;
  recipient: string;
  phone: string;
  address: string;
  detailAddress: string;
  isDefault: boolean;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: NewAddressFormValues) => void;
}

export function AddressCreateDialog({ open, onOpenChange, onSubmit }: Props) {
  const { t } = useTranslation();

  const methods = useForm<NewAddressFormValues>({
    mode: "onChange",
    defaultValues: {
      name: "",
      recipient: "",
      phone: "",
      address: "",
      detailAddress: "",
      isDefault: false,
    },
  });

  const { register, handleSubmit, reset, control } = methods;

  const submit = handleSubmit((values) => {
    if (!values.name || !values.recipient || !values.phone || !values.address) {
      alert(t("order.alert.requiredFields"));
      return;
    }
    onSubmit(values);
    reset();
  });

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
              <Input placeholder={t("order.addressDialog.namePlaceholder")} className="mt-2" {...register("name")} />
            </div>

            <div>
              <Label>{t("order.addressDialog.recipient")} *</Label>
              <Input
                placeholder={t("order.addressDialog.recipientPlaceholder")}
                className="mt-2"
                {...register("recipient")}
              />
            </div>

            <div>
              <Label>{t("order.addressDialog.phone")} *</Label>
              <Input placeholder={t("order.addressDialog.phonePlaceholder")} className="mt-2" {...register("phone")} />
            </div>

            <div>
              <Label>{t("order.addressDialog.address")} *</Label>
              <div className="flex gap-2 mt-2">
                <Input placeholder={t("order.addressDialog.addressPlaceholder")} className="flex-1" {...register("address")} />
                <Button variant="outline" type="button">
                  {t("order.common.search")}
                </Button>
              </div>
            </div>

            <div>
              <Label>{t("order.addressDialog.detailAddress")}</Label>
              <Input
                placeholder={t("order.addressDialog.detailAddressPlaceholder")}
                className="mt-2"
                {...register("detailAddress")}
              />
            </div>

            <div className="flex items-center gap-2">
              <Controller
                name="isDefault"
                control={control}
                render={({ field }) => (
                  <Checkbox checked={!!field.value} onCheckedChange={(v) => field.onChange(!!v)} id="new-default" />
                )}
              />
              <Label htmlFor="new-default">{t("order.addressDialog.setDefault")}</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={submit} className="flex-1">
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
