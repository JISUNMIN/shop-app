import { LangCode, Product } from "@/types";
import { formatPrice } from "@/utils/helper";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";

type RecommendedProductsSectionProps = {
  productList: Product[];
};

export default function RecommendedProductsSection({
  productList,
}: RecommendedProductsSectionProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as LangCode;
  const router = useRouter();

  if (!productList?.length) return null;

  const onCardKeyDown = (e: KeyboardEvent<HTMLDivElement>, productId: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(`/product/${productId}`);
    }
  };

  return (
    <div className="mb-12 sm:mb-16">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
        {t("product.recommendedProductsTitle")}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {productList.map((product) => (
          <div
            key={product.id}
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/product/${product.id}`)}
            onKeyDown={(e) => onCardKeyDown(e, product.id)}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-shadow cursor-pointer"
          >
            <div className="aspect-square bg-gray-100 relative">
              <Image
                src={product.images?.[0] ?? "/images/placeholder.png"}
                alt={product.name?.[lang] ?? ""}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>

            <div className="p-3 sm:p-4">
              <h3 className="font-medium mb-1 sm:mb-2 line-clamp-2">
                {product.name?.[lang] ?? ""}
              </h3>
              <p className="text-base sm:text-lg font-semibold">{formatPrice(product.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
