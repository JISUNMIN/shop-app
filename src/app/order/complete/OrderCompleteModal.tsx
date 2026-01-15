"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CheckCircle2, X } from "lucide-react";
import Lottie from "lottie-react";
import runningAnimation from "@/lottie/running.json";
import { useTranslation } from "@/context/TranslationContext";
import { formatPrice, formatString } from "@/utils/helper";
import { useLangStore } from "@/store/langStore";

interface OrderedItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderedItems: OrderedItem[];
}

export default function OrderCompleteModal({
  isOpen,
  onClose,
  orderedItems,
}: OrderCompleteModalProps) {
  const [showRobot, setShowRobot] = useState(true);
  const [showCheck, setShowCheck] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const t = useTranslation();
  const { lang } = useLangStore();

  useEffect(() => {
    if (!isOpen) return;
    setShowRobot(true);
    setShowCheck(false);
    setShowButton(false);

    const timer = setTimeout(() => {
      setShowRobot(false);
      setShowCheck(true);
      setTimeout(() => setShowButton(true), 500);
    }, 1800);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const totalItems = orderedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = orderedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg relative"
          >
            <Card className="text-center shadow-xl rounded-3xl overflow-hidden relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label={t.close}
              >
                <X className="w-6 h-6" />
              </button>

              <CardHeader className="flex flex-col items-center space-y-4 pt-12">
                <AnimatePresence>
                  {showRobot && (
                    <motion.div
                      className="w-28 h-28"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Lottie animationData={runningAnimation} loop />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showCheck && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1.3 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <h1 className="text-3xl font-bold">{t.orderComplete}</h1>
                <p className="text-muted-foreground text-base">
                  {formatString(t.orderSuccessMsg, { count: totalItems })}
                </p>
              </CardHeader>

              <CardContent className="space-y-6 flex flex-col items-center w-full">
                {orderedItems.length > 0 && (
                  <div className="w-full text-left space-y-2">
                    {orderedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between border-b pb-1"
                      >
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>
                          {formatString(t.price, {
                            price: formatPrice(
                              item.price * item.quantity,
                              lang
                            ),
                          })}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold pt-2">
                      <span>{t.totalAmount}</span>
                      <span>
                        {formatString(t.price, {
                          price: formatPrice(totalPrice, lang),
                        })}
                      </span>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {showButton && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center gap-4 w-full"
                    >
                      <Button size="lg" className="flex-1" onClick={onClose}>
                        {t.continueShopping}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
