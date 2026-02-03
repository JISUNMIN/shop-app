"use client";

import { useEffect, useState } from "react";
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

  const totalPrice = orderedItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-14">
      <main className="w-full max-w-2xl space-y-10">
        <section className="text-center space-y-4">
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
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <CheckCircle2 className="mx-auto h-20 w-20 text-green-500" />
              </motion.div>
            )}
          </AnimatePresence>

          <h1 className="text-4xl font-bold tracking-tight">{t("orderComplete")}</h1>

          {isReady && (
            <p className="text-gray-500 text-lg">{t("orderSuccessMsg", { count: totalItems })}</p>
          )}
        </section>

        {(orderedItems?.length ?? 0) > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <h2 className="text-lg font-semibold">{t("orderSummary")}</h2>

            <div className="space-y-3">
              {orderedItems?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm border-b pb-2">
                  <span className="text-gray-700">
                    {item.product.name[lang]} × {item.quantity}
                  </span>

                  <span className="font-medium">
                    {t("price", {
                      price: formatPrice(item.price * item.quantity, lang),
                    })}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-base font-bold pt-4">
              <span>{t("totalAmount")}</span>
              <span className="text-green-600">
                {t("price", {
                  price: formatPrice(totalPrice, lang),
                })}
              </span>
            </div>
          </section>
        )}

        <AnimatePresence>
          {step === "button" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex justify-center"
            >
              <Button
                size="lg"
                className="w-full rounded-xl text-lg py-6"
                onClick={() => router.push("/")}
              >
                {t("continueShopping")}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
