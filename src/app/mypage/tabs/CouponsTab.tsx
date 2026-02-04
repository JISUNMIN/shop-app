import { Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCoupon from "@/hooks/useCoupon";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import CouponsTabSkeleton from "../_components/CouponsTabSkeleton";

type CouponStatus = "AVAILABLE" | "USED" | "EXPIRED" | "REVOKED";

export default function CouponsTab() {
  const { t } = useTranslation();
  const { listData, isListLoading } = useCoupon();
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = () => {
    setErrorMsg(t("mypage.coupons.invalidCode"));
    return;
  };

  const now = useMemo(() => new Date(), []);

  const items = listData ?? [];

  const { availableCoupons, pastCoupons } = useMemo(() => {
    const available: any[] = [];
    const past: any[] = [];

    items.forEach((c) => {
      const status = c.status as CouponStatus;

      const expiredByDate = c.expiresAt ? new Date(c.expiresAt) < now : false;
      const isExpired = status === "EXPIRED" || expiredByDate;

      if (status === "USED" || isExpired || status === "REVOKED") past.push(c);
      else available.push(c);
    });

    // (선택) available은 만료 임박순으로 정렬하면 UX 좋음
    available.sort((a, b) => +new Date(a.expiresAt) - +new Date(b.expiresAt));
    // past는 최신 사용/만료순
    past.sort((a, b) => +new Date(b.expiresAt) - +new Date(a.expiresAt));

    return { availableCoupons: available, pastCoupons: past };
  }, [items, now]);

  const getDday = (expiresAt?: string | Date | null) => {
    if (!expiresAt) return null;

    const end = new Date(expiresAt);

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfEnd = new Date(end);
    startOfEnd.setHours(0, 0, 0, 0);

    const diffMs = startOfEnd.getTime() - startOfToday.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return null;
    if (diffDays <= 7) return diffDays;

    return null;
  };

  const CouponCard = ({ coupon }: { coupon: any }) => {
    const couponData = coupon.coupon;

    const isUsed = coupon.status === "USED";
    const isExpiredByStatus = coupon.status === "EXPIRED";
    const isExpiredByDate = coupon.expiresAt ? new Date(coupon.expiresAt) < now : false;
    const isExpired = isExpiredByStatus || isExpiredByDate;

    const isUnavailable = isUsed || isExpired || coupon.status === "REVOKED";

    const discountText =
      couponData.discountType === "PERCENT"
        ? t("mypage.coupons.discountPercent", { value: couponData.discountValue })
        : t("mypage.coupons.discountAmount", { value: couponData.discountValue });

    const minOrderText =
      (couponData.minOrderAmount ?? 0) > 0
        ? t("mypage.coupons.minOrder", { amount: couponData.minOrderAmount })
        : t("mypage.coupons.noLimit");

    const expiresText = new Date(coupon.expiresAt).toLocaleDateString("ko-KR");

    const dday = !isUnavailable ? getDday(coupon.expiresAt) : null;

    const statusBadge = isExpired ? (
      <Badge className="bg-red-100 text-red-700 border border-red-200">
        {t("mypage.coupons.expired")}
      </Badge>
    ) : isUsed ? (
      <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
        {t("mypage.coupons.used")}
      </Badge>
    ) : null;

    return (
      <Card
        className={[
          "relative overflow-hidden transition",
          isUnavailable ? "opacity-60" : "hover:shadow-md",
        ].join(" ")}
      >
        <div
          className={[
            "absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 opacity-20",
            isUnavailable
              ? "bg-gradient-to-br from-gray-400 to-gray-600"
              : "bg-gradient-to-br from-yellow-400 to-orange-500",
          ].join(" ")}
        />

        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          {/* 만료 임박 D-day */}
          {dday !== null && (
            <Badge className="bg-red-100 text-red-700 border border-red-200">
              {dday === 0 ? t("mypage.coupons.expiresToday") : `D-${dday}`}
            </Badge>
          )}
          {statusBadge}
        </div>

        <div className="p-6 relative">
          <div className="flex items-start justify-between mb-3">
            <Gift
              className={["w-8 h-8", isUnavailable ? "text-gray-500" : "text-orange-500"].join(" ")}
            />

            <Badge
              variant="outline"
              className={[
                "border",
                isUnavailable
                  ? "text-gray-600 border-gray-300"
                  : "text-orange-600 border-orange-300",
              ].join(" ")}
            >
              {discountText}
            </Badge>
          </div>

          <h3 className="font-bold text-lg mb-2">{couponData.name}</h3>

          <p className="text-sm text-gray-600 mb-1">{minOrderText}</p>

          <p className="text-xs text-gray-500">
            {t("mypage.coupons.expiresUntil", { date: expiresText })}
          </p>

          {isUnavailable && (
            <p className="mt-3 text-xs text-gray-600">
              {isExpired ? t("mypage.coupons.expiredDesc") : t("mypage.coupons.usedDesc")}
            </p>
          )}
        </div>
      </Card>
    );
  };

  if (isListLoading) return <CouponsTabSkeleton />;

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("mypage.coupons.title")}</h1>
      <p className="text-gray-600 mb-6">
        {t("mypage.coupons.availableCount", { count: availableCoupons.length })}
      </p>

      {/* 사용 가능한 쿠폰 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableCoupons.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>

      {/* 사용된/만료된 쿠폰 */}
      {pastCoupons.length > 0 && (
        <div className="mt-10">
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">
              {t("mypage.coupons.pastTitle", "지난 쿠폰")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        </div>
      )}

      {/* 쿠폰 등록 */}
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
