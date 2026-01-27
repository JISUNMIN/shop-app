// app/order/_components/sections/OrderShippingSection.tsx
import { Truck, Plus, CheckCircle2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Controller, useFormContext } from "react-hook-form";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import type { Address } from "@/types";
import type { OrderFormValues } from "@/app/order/_components/OrderShell";
import useAddress from "@/hooks/useAddress";

interface Props {
  addresses: Address[];
  onOpenAddressDialog: () => void;
}

export function OrderShippingSection({ addresses, onOpenAddressDialog }: Props) {
  const { t } = useTranslation();
  const { control, watch, setValue, register } = useFormContext<OrderFormValues>();

  const { removeAddressMutate, isRemovePending } = useAddress();

  const selectedAddressId = watch("selectedAddressId");
  const deliveryMemo = watch("deliveryMemo");

  const memoOptions = [
    { value: "custom", label: t("order.deliveryMemo.options.custom") },
    { value: "frontDoor", label: t("order.deliveryMemo.options.frontDoor") },
    { value: "guardOffice", label: t("order.deliveryMemo.options.guardOffice") },
    { value: "parcelBox", label: t("order.deliveryMemo.options.parcelBox") },
    { value: "callBefore", label: t("order.deliveryMemo.options.callBefore") },
    { value: "callIfAbsent", label: t("order.deliveryMemo.options.callIfAbsent") },
  ];

  const handleDelete = async (addressId: number) => {
    await removeAddressMutate({ addressId });

    if (selectedAddressId === addressId) {
      const remaining = (addresses ?? []).filter((a) => a.id !== addressId);
      const nextId = remaining.find((a) => a.isDefault)?.id ?? remaining[0]?.id ?? null;
      setValue("selectedAddressId", nextId as any, { shouldDirty: true });
    }
  };

  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5" />
          <h2 className="text-lg md:text-xl font-bold">{t("order.shipping.title")}</h2>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAddressDialog}
          disabled={addresses?.length >= 5}
        >
          <Plus className="w-4 h-4 mr-1" />
          {t("order.shipping.newAddress")}
        </Button>
      </div>
      {addresses?.length >= 5 && (
        <p className="text-xs text-gray-500 mt-1">{t("order.shipping.maxAddress")}</p>
      )}

      <div className="space-y-3">
        {addresses?.map((address) => (
          <div
            key={address.id}
            onClick={() => setValue("selectedAddressId", address.id, { shouldDirty: true })}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedAddressId === address.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="font-bold">{address.label}</p>
                {address.isDefault && (
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    {t("order.shipping.default")}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedAddressId === address.id && (
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={isRemovePending}
                  onClick={() => {
                    handleDelete(address.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-1">
              {address.name} · {address.phone}
            </p>
            <p className="text-sm text-gray-600">
              {address.address} {address.detailAddress}
            </p>
          </div>
        ))}
      </div>

      {addresses?.length > 0 && (
        <>
          <Separator className="my-4" />

          <div className="space-y-4">
            <div>
              <Label>{t("order.deliveryMemo.label")}</Label>

              <Controller
                control={control}
                name="deliveryMemo"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {memoOptions.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {deliveryMemo === "custom" && (
              <div>
                <Textarea
                  placeholder={t("order.deliveryMemo.placeholder")}
                  className="resize-none"
                  rows={3}
                  {...register("customMemo")}
                />
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
