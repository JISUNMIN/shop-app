"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Lottie from "lottie-react";
import runningAnimation from "@/lottie/running.json";
import { formatPrice } from "@/utils/helper";
import { useTranslation } from "react-i18next";
import type { LocalizedText } from "@/types";
import useOrder from "@/hooks/useOrder";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderCompleteShell() {
  const router = useRouter();
  const { orderId } = useParams();

  const { detailData, isDetailLoading } = useOrder(Number(orderId));
  const orderedItems = detailData?.orderItems;

  const { t, i18n } = useTranslation();
  const lang = i18n.language as keyof LocalizedText;

  const [step, setStep] = useState<"loading" | "success" | "button">("loading");

  const isReady = !isDetailLoading && !!detailData;

  useEffect(() => {
    if (!isReady) return;

    const timer1 = setTimeout(() => setStep("success"), 800);
    const timer2 = setTimeout(() => setStep("button"), 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isReady]);

  const totalItems = orderedItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const discountAmount = detailData?.discountAmount ?? 0;
  const totalAmount = detailData?.totalAmount ?? 0;

  const subtotal = useMemo(() => {
    return Math.max(0, totalAmount + discountAmount);
  }, [totalAmount, discountAmount]);

  const hasDiscount = discountAmount > 0;

  const format = (value: number) =>
    t("price", {
      price: formatPrice(value, lang),
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-white">
      <div className="relative flex justify-center px-4 py-14">
        <main className="w-full max-w-2xl space-y-10">
          <motion.section initial="hidden" animate="show" className="text-center">
            <div className="mx-auto w-full max-w-xl rounded-3xl border border-white bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] px-6 py-10">
              <AnimatePresence mode="wait">
                {step === "loading" && (
                  <motion.div
                    key="loading"
                    className="mx-auto w-28 h-28"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Lottie animationData={runningAnimation} loop />
                  </motion.div>
                )}

                {step !== "loading" && (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="mx-auto flex items-center justify-center"
                  >
                    <div className="rounded-full bg-emerald-50 p-4 ring-1 ring-emerald-100">
                      <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <h1 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                {t("orderComplete")}
              </h1>

              {isReady && (
                <p className="mt-3 text-gray-600 text-base sm:text-lg">
                  {t("orderSuccessMsg", { count: totalItems })}
                </p>
              )}

              {isReady && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-gray-900 text-white px-3 py-1 text-xs font-medium shadow-sm">
                    #{detailData?.id}
                  </span>
                </div>
              )}
            </div>
          </motion.section>

          {/* 주문 요약 */}
          {(orderedItems?.length ?? 0) > 0 && (
            <motion.section
              initial="hidden"
              animate="show"
              className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-gray-100 bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">{t("orderSummary")}</h2>
                    <p className="mt-1 text-xs text-gray-500">
                      {t("quantity", { count: totalItems })}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-400">Order</p>
                    <p className="text-sm font-semibold text-gray-900">#{detailData?.id}</p>
                  </div>
                </div>
              </div>

              <div className="px-5">
                <div className="divide-y divide-gray-100">
                  {orderedItems?.map((item) => {
                    const lineTotal = item.price * item.quantity;

                    return (
                      <div key={item.id} className="py-3 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name[lang]}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {t("quantity", { count: item.quantity })}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className="inline-flex items-center rounded-lg bg-transparent px-0 py-0 text-sm font-semibold text-gray-900">
                            {format(lineTotal)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 금액 요약 */}
              <div className="px-5 py-4 bg-white border-t border-gray-100">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{t("subtotal")}</span>
                    <span className="font-semibold text-gray-900">{format(subtotal)}</span>
                  </div>

                  {hasDiscount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("discountAmount")}</span>
                      <span className="font-semibold text-rose-600">-{format(discountAmount)}</span>
                    </div>
                  )}

                  <div className="h-px bg-gray-100 my-2" />

                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-semibold text-gray-900">
                      {t("totalAmount")}
                    </span>
                    <span className="text-lg font-bold tracking-tight text-gray-900">
                      {format(totalAmount)}
                    </span>
                  </div>

                  {hasDiscount && (
                    <p className="text-xs text-gray-500">
                      {t("discountSavedMsg", {
                        amount: formatPrice(discountAmount, lang),
                      })}
                    </p>
                  )}
                </div>
              </div>
            </motion.section>
          )}

          <AnimatePresence>
            {step === "button" && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:flex-1 rounded-2xl text-base py-5 border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
                  onClick={() => router.push(`/orders/${detailData?.id}`)}
                >
                  {t("viewOrderDetail")}
                </Button>

                <Button
                  size="lg"
                  className="w-full sm:flex-1 rounded-2xl text-base py-5 bg-gray-900 text-white hover:bg-gray-800 shadow-none"
                  onClick={() => router.push("/")}
                >
                  {t("continueShopping")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
