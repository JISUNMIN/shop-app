import { Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCoupon from "@/hooks/useCoupon";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import CouponsTabSkeleton from "../_components/CouponsTabSkeleton";

export default function CouponsTab() {
  const { t } = useTranslation();
  const { listData, isListLoading } = useCoupon();
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = () => {
    setErrorMsg(t("mypage.coupons.invalidCode"));
    return;
  };

  if (isListLoading) {
    return <CouponsTabSkeleton />;
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("mypage.coupons.title")}</h1>
      <p className="text-gray-600 mb-6">
        {t("mypage.coupons.availableCount", { count: listData?.length ?? 0 })}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listData?.map((coupon) => {
          const couponData = coupon.coupon;

          const discountText =
            couponData.discountType === "PERCENT"
              ? t("mypage.coupons.discountPercent", { value: couponData.discountValue })
              : t("mypage.coupons.discountAmount", { value: couponData.discountValue });

          const minOrderText =
            (couponData.minOrderAmount ?? 0) > 0
              ? t("mypage.coupons.minOrder", { amount: couponData.minOrderAmount })
              : t("mypage.coupons.noLimit");

          const expiresText = new Date(coupon.expiresAt).toLocaleDateString("ko-KR");

          return (
            <Card key={coupon.id} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full -mr-12 -mt-12 opacity-20" />
              <div className="p-6 relative">
                <div className="flex items-start justify-between mb-3">
                  <Gift className="w-8 h-8 text-orange-500" />
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    {discountText}
                  </Badge>
                </div>

                <h3 className="font-bold text-lg mb-2">{couponData.name}</h3>

                <p className="text-sm text-gray-600 mb-1">{minOrderText}</p>

                <p className="text-xs text-gray-500">
                  {t("mypage.coupons.expiresUntil", { date: expiresText })}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 p-4 md:p-6 bg-gray-50 border-dashed">
        <p className="text-center text-gray-600 mb-3">{t("mypage.coupons.enterCode")}</p>

        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setErrorMsg("");
            }}
            placeholder={t("mypage.coupons.codePlaceholder")}
            className="flex-1"
          />

          <Button onClick={handleRegister} className="w-full sm:w-auto">
            {t("mypage.coupons.register")}
          </Button>
        </div>

        {errorMsg && <p className="text-sm text-red-500 mt-2">{errorMsg}</p>}
      </Card>
    </div>
  );
}
