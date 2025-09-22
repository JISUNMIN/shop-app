"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Lottie from "lottie-react";
import runningAnimation from "@/lottie/running.json";

export default function OrderCompletePage() {
  const router = useRouter();
  const [showRobot, setShowRobot] = useState(true);
  const [showCheck, setShowCheck] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRobot(false);
      setShowCheck(true);
      setTimeout(() => setShowButton(true), 500);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container py-20 flex justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="text-center shadow-xl rounded-3xl overflow-hidden relative">
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

            <h1 className="text-3xl font-bold">주문이 완료되었습니다!</h1>
            <p className="text-muted-foreground text-base">
              로봇 주문이 성공적으로 접수되었습니다. <br />
              빠른 시일 내에 배송해드리겠습니다.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 flex flex-col items-center">
            <AnimatePresence>
              {showButton && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center gap-4 w-full"
                >
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={() => router.push("/")}
                  >
                    쇼핑 계속하기
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
