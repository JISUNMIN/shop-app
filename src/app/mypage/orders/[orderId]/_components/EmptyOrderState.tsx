"use client";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function EmptyOrderState({ message }: { message: string }) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500 mb-6">{message}</p>
        <button
          onClick={() => router.replace("/mypage?tab=orders")}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          {t("mypage.orderDetail.backToOrders")}
        </button>
      </div>
    </div>
  );
}
