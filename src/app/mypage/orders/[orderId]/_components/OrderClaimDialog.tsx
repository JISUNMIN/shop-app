"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import useOrderClaim, { ClaimPayload } from "@/hooks/useOrderClaim";

type RequestMode = "cancel" | "return_exchange";
type ReturnExchangeType = "return" | "exchange";

type OrderClaimDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: RequestMode;
  refundAmount: string;
  orderId?: number;
};

export default function OrderClaimDialog({
  open,
  onOpenChange,
  mode,
  refundAmount,
  orderId,
}: OrderClaimDialogProps) {
  const { t } = useTranslation();

  const [cancelReason, setCancelReason] = React.useState("");
  const [returnExchangeType, setReturnExchangeType] = React.useState<ReturnExchangeType | "">(
    "return",
  );
  const [returnExchangeReason, setReturnExchangeReason] = React.useState("");
  const [typeError, setTypeError] = React.useState(false);
  const { orderClaimMutate, isOrderClaimPending } = useOrderClaim();

  const reset = React.useCallback(() => {
    setCancelReason("");
    setReturnExchangeType("");
    setReturnExchangeReason("");
    setTypeError(false);
  }, []);

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  const handleConfirm = () => {
    if (mode === "return_exchange" && !returnExchangeType) {
      setTypeError(true);
      return;
    }

    const payload =
      mode === "cancel"
        ? {
            id: orderId,
            cancelReason: cancelReason.trim() ?? "",
          }
        : {
            id: orderId,
            returnReason: returnExchangeReason.trim() ?? "",
            // returnExchangeType: returnExchangeType,
          };

    orderClaimMutate(payload);
    handleClose(false);
  };

  const titleKey =
    mode === "cancel"
      ? "mypage.orderDetail.requestDialog.title.cancel"
      : "mypage.orderDetail.requestDialog.title.returnExchange";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{t(titleKey)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {orderId != null && (
            <div className="text-sm text-gray-600">
              {t("mypage.orderDetail.requestDialog.orderNumber", { id: orderId })}
            </div>
          )}

          {/* 환불될 금액 */}
          <div className="rounded-lg border bg-gray-50 p-3">
            <div className="text-xs text-gray-500">
              {t("mypage.orderDetail.requestDialog.refundAmount")}
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900">{refundAmount}</div>
          </div>

          {mode === "cancel" ? (
            <>
              {/* 취소 사유 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">
                  {t("mypage.orderDetail.requestDialog.cancelReason.label")}
                </label>
                <Input
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder={t("mypage.orderDetail.requestDialog.cancelReason.placeholder")}
                />
              </div>
            </>
          ) : (
            <>
              {/* 반품/교환 선택 */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-800">
                  {t("mypage.orderDetail.requestDialog.returnExchangeType.label")}
                </div>

                <RadioGroup
                  value={returnExchangeType}
                  onValueChange={(v) => {
                    setReturnExchangeType(v as ReturnExchangeType);
                    setTypeError(false);
                  }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="return" id="re-return" />
                    <Label htmlFor="re-return">
                      {t("mypage.orderDetail.requestDialog.returnExchangeType.options.return")}
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="exchange" id="re-exchange" />
                    <Label htmlFor="re-exchange">
                      {t("mypage.orderDetail.requestDialog.returnExchangeType.options.exchange")}
                    </Label>
                  </div>
                </RadioGroup>

                {typeError && (
                  <p className="text-xs text-red-600">
                    {t("mypage.orderDetail.requestDialog.returnExchangeType.error")}
                  </p>
                )}
              </div>

              {/* 반품/교환 사유 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">
                  {t("mypage.orderDetail.requestDialog.returnExchangeReason.label")}
                </label>
                <Input
                  value={returnExchangeReason}
                  onChange={(e) => setReturnExchangeReason(e.target.value)}
                  placeholder={t(
                    "mypage.orderDetail.requestDialog.returnExchangeReason.placeholder",
                  )}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-4">
          <Button type="button" variant="outline" onClick={() => handleClose(false)}>
            {t("mypage.orderDetail.requestDialog.actions.close")}
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={isOrderClaimPending}>
            {t("mypage.orderDetail.requestDialog.actions.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
