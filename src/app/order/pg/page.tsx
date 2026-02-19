"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Wallet, CheckCircle2, XCircle, Loader2, Landmark } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useOrder, { type CreateOrderPayload } from "@/hooks/useOrder";
import useCart from "@/hooks/useCart";
import type { PaymentMethod } from "@/app/order/_components/OrderShell";

type PendingOrder = {
  payload: CreateOrderPayload;
  paymentMethod: PaymentMethod;
  cartItemIdsToRemove?: number[];
};

type PgStatus = "ready" | "processing" | "success" | "finalizing" | "fail";

const PENDING_KEY = "order:pending";
const LOCK_KEY = "order:pending:lock";
const ORDER_ID_KEY = "order:pending:orderId";
const LOCK_TTL_MS = 1000 * 90;

function methodLabel(m: PaymentMethod, t: (key: string, opt?: any) => string) {
  switch (m) {
    case "CARD":
      return t("order.pg.method.card");
    case "BANK":
      return t("order.pg.method.bank");
    case "KAKAO":
      return t("order.pg.method.kakao");
    case "NAVER":
      return t("order.pg.method.naver");
    default:
      return m;
  }
}

function pgBrand(m: PaymentMethod, t: (key: string, opt?: any) => string) {
  switch (m) {
    case "BANK":
      return { name: t("order.pg.brand.bank"), badgeClass: "bg-slate-400" };
    case "KAKAO":
      return { name: t("order.pg.brand.kakao"), badgeClass: "bg-yellow-400" };
    case "NAVER":
      return { name: t("order.pg.brand.naver"), badgeClass: "bg-green-500" };
    case "CARD":
    default:
      return { name: t("order.pg.brand.card"), badgeClass: "bg-blue-500" };
  }
}

function isValidPending(p: any): p is PendingOrder {
  const payload = p?.payload as CreateOrderPayload | undefined;
  console.log("payload", payload);
  if (!payload) return false;

  if (!Array.isArray(payload.products) || payload.products.length === 0) return false;
  if (!Number.isFinite(payload.totalAmount) || payload.totalAmount <= 0) return false;

  for (const it of payload.products) {
    const productId = Number(it?.productId);
    const quantity = Number(it?.quantity);
    const price = Number(it?.price);

    if (!Number.isFinite(productId) || productId <= 0) return false;
    if (!Number.isFinite(quantity) || quantity <= 0) return false;
    if (!Number.isFinite(price) || price < 0) return false;
  }

  const pm = p?.paymentMethod as PaymentMethod | undefined;
  if (!pm || !["CARD", "BANK", "KAKAO", "NAVER"].includes(pm)) return false;

  const ids = p?.cartItemIdsToRemove;
  if (ids != null) {
    if (!Array.isArray(ids)) return false;
    if (ids.some((x: any) => !Number.isFinite(Number(x)))) return false;
  }

  return true;
}

function formatDeadline(daysToAdd: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysToAdd);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}

export default function OrderPgPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { createOrderMutate, isCreateOrderPending } = useOrder();
  const { removeFromCartMutate } = useCart();

  const [pending, setPending] = useState<PendingOrder | null>(null);
  const [status, setStatus] = useState<PgStatus>("ready");
  const [message, setMessage] = useState<string>("");
  const [locked, setLocked] = useState<boolean>(false);

  useEffect(() => {
    const savedOrderId = sessionStorage.getItem(ORDER_ID_KEY);
    if (savedOrderId) {
      router.replace(`/order/complete/${savedOrderId}`);
      return;
    }

    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) {
      router.back();
      return;
    }

    try {
      const parsed = JSON.parse(raw);

      if (!isValidPending(parsed)) {
        sessionStorage.removeItem(PENDING_KEY);
        sessionStorage.removeItem(LOCK_KEY);
        router.back();

        return;
      }

      setPending(parsed);

      const lock = sessionStorage.getItem(LOCK_KEY);
      if (lock) {
        const lockTs = Number(lock);
        const isExpired = !Number.isFinite(lockTs) || Date.now() - lockTs > LOCK_TTL_MS;

        if (isExpired) {
          sessionStorage.removeItem(LOCK_KEY);
          setLocked(false);
          setStatus("ready");
          setMessage("");
        } else {
          setLocked(true);
          setStatus("finalizing");
          setMessage(t("order.pg.finalizing"));
        }
      } else {
        if (parsed.paymentMethod === "BANK") {
          setStatus("success");
          setMessage(t("order.pg.bankGuide"));
        }
      }
    } catch {
      sessionStorage.removeItem(PENDING_KEY);
      sessionStorage.removeItem(LOCK_KEY);
      router.back();
    }
  }, [router, t]);

  const ui = useMemo(() => (pending ? pgBrand(pending.paymentMethod, t) : null), [pending, t]);
  const amount = pending?.payload?.totalAmount ?? 0;

  const isBank = pending?.paymentMethod === "BANK";
  const deadlineText = useMemo(() => formatDeadline(2), []);

  const bankInfo = {
    bankName: "신한은행",
    account: "110-123-456789",
    holder: "(주)로보샵",
  };

  const startMockPayment = () => {
    if (!pending) return;
    if (locked || isCreateOrderPending) return;

    setStatus("processing");
    setMessage(t("order.pg.processing"));

    window.setTimeout(() => {
      setStatus("success");
      setMessage(t("order.pg.approved"));
    }, 1200);
  };

  const confirmSuccess = () => {
    if (!pending) return;
    if (locked) return;
    if (isCreateOrderPending) return;

    sessionStorage.setItem(LOCK_KEY, String(Date.now()));
    setLocked(true);
    setMessage(isBank ? t("order.pg.creatingBankPendingOrder") : t("order.pg.creatingOrder"));

    createOrderMutate(
      { ...pending.payload, paymentMethod: pending.paymentMethod },
      {
        onSuccess: (data: any) => {
          const ids = pending.cartItemIdsToRemove ?? [];
          ids.forEach((itemId) => {
            removeFromCartMutate({ itemId, showToast: false });
          });

          const orderId = data?.id;
          if (orderId == null) {
            sessionStorage.removeItem(LOCK_KEY);
            setLocked(false);
            setStatus("fail");
            setMessage(t("order.pg.cannotGetOrderId"));
            return;
          }

          sessionStorage.setItem(ORDER_ID_KEY, String(orderId));
          sessionStorage.removeItem(PENDING_KEY);
          sessionStorage.removeItem(LOCK_KEY);

          router.replace(`/order/complete/${orderId}`);
        },
        onError: () => {
          sessionStorage.removeItem(LOCK_KEY);
          setLocked(false);
          setStatus("fail");
          setMessage(t("order.pg.createOrderFailed"));
        },
      },
    );
  };

  const goBack = () => {
    sessionStorage.removeItem(LOCK_KEY);
    sessionStorage.removeItem(ORDER_ID_KEY);
    router.back();
  };

  if (!pending || !ui) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg space-y-4">
        <Card className="p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-500">{t("order.pg.title")}</div>
              <div className="text-lg font-bold">{ui.name}</div>
            </div>
            <div className={`w-3 h-3 rounded-full ${ui.badgeClass}`} />
          </div>

          <div className="rounded-lg border p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">{t("order.pg.paymentMethod")}</div>
              <div className="font-medium flex items-center gap-2">
                {pending.paymentMethod === "CARD" ? (
                  <CreditCard className="w-4 h-4" />
                ) : pending.paymentMethod === "BANK" ? (
                  <Landmark className="w-4 h-4" />
                ) : (
                  <Wallet className="w-4 h-4" />
                )}
                {methodLabel(pending.paymentMethod, t)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">{t("order.pg.paymentAmount")}</div>
              <div className="text-xl font-bold">{Number(amount).toLocaleString()}원</div>
            </div>

            {isBank && (
              <div className="mt-2 rounded-lg bg-gray-50 border px-3 py-3 space-y-2">
                <div className="text-sm font-semibold text-gray-900">
                  {t("order.pg.depositAccountGuide")}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{t("order.pg.bank")}</span>
                  <span className="font-medium text-gray-900">{bankInfo.bankName}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{t("order.pg.accountNumber")}</span>
                  <span className="font-medium text-gray-900">{bankInfo.account}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{t("order.pg.accountHolder")}</span>
                  <span className="font-medium text-gray-900">{bankInfo.holder}</span>
                </div>

                <div className="text-xs text-gray-600 pt-1">
                  {t("order.pg.depositDeadline", { date: deadlineText })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4" aria-live="polite">
            {status === "ready" && !isBank && (
              <div className="space-y-3">
                <div className="text-sm text-gray-600">{t("order.pg.ctaHint")}</div>
                <Button
                  className="w-full"
                  onClick={startMockPayment}
                  disabled={locked || isCreateOrderPending}
                >
                  {t("order.pg.payNow")}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={goBack}
                  disabled={isCreateOrderPending}
                >
                  {t("order.pg.cancelToOrderForm")}
                </Button>
              </div>
            )}

            {status === "processing" && (
              <div className="flex flex-col items-center gap-3 py-6">
                <Loader2 className="w-7 h-7 animate-spin" />
                <div className="text-sm text-gray-700">
                  {message || t("order.pg.genericProcessing")}
                </div>
              </div>
            )}

            {(status === "success" || (status === "ready" && isBank)) && (
              <div className="space-y-3 py-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <div className="font-medium">
                    {message || (isBank ? t("order.pg.bankGuide") : t("order.pg.approved"))}
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={confirmSuccess}
                  disabled={locked || isCreateOrderPending}
                >
                  {isBank ? t("order.pg.confirmBankPendingOrder") : t("order.pg.confirmPaidOrder")}
                </Button>

                {!isBank && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      if (locked || isCreateOrderPending) return;
                      setStatus("fail");
                      setMessage(t("order.pg.userCanceled"));
                    }}
                    disabled={locked || isCreateOrderPending}
                  >
                    {t("order.pg.cancelPaymentFail")}
                  </Button>
                )}

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={goBack}
                  disabled={locked || isCreateOrderPending}
                >
                  {t("order.pg.backToOrderForm")}
                </Button>
              </div>
            )}

            {status === "finalizing" && (
              <div className="flex flex-col items-center gap-3 py-6">
                <Loader2 className="w-7 h-7 animate-spin" />
                <div className="text-sm text-gray-700">
                  {message || t("order.pg.genericFinalizing")}
                </div>
              </div>
            )}

            {status === "fail" && (
              <div className="space-y-3 py-4">
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-5 h-5" />
                  <div className="font-medium">{message || t("order.pg.genericFailed")}</div>
                </div>

                <Button className="w-full" onClick={goBack} disabled={isCreateOrderPending}>
                  {t("order.pg.backToOrderForm")}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (locked) return;
                    setStatus(isBank ? "success" : "ready");
                    setMessage(isBank ? t("order.pg.bankGuide") : "");
                  }}
                  disabled={locked || isCreateOrderPending}
                >
                  {t("order.pg.retry")}
                </Button>
              </div>
            )}
          </div>
        </Card>

        <div className="text-xs text-gray-400 text-center">{t("order.pg.footerExample")}</div>
      </div>
    </div>
  );
}
