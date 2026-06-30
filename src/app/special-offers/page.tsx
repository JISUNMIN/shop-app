import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/utils/helper";

const SALE_DISCOUNTS = [30, 25, 20, 18, 15, 12];

export default async function SpecialOffersPage() {
  const products = await prisma.product.findMany({
    orderBy: { price: "desc" },
    take: 6,
  });

  return (
    <div className="space-y-8 py-8">
      <section className="overflow-hidden rounded-[2rem] bg-[#0c1b2e] px-6 py-8 text-white shadow-[0_26px_70px_-34px_rgba(12,27,46,0.82)] md:px-10 md:py-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9dd0ff]">
          Special Offers
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-[-0.03em] md:text-5xl">
          인기 모델 할인 모아보기
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72 md:text-base">
          지금 추천하는 프리미엄 로봇과 인기 모델을 할인 가격으로 비교해보세요.
        </p>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => {
            const discountRate = SALE_DISCOUNTS[index] ?? 10;
            const salePrice = Math.round(product.price * (1 - discountRate / 100));
            const name = (product.name as { ko?: string; en?: string })?.ko ?? "상품";

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_20px_55px_-24px_rgba(15,23,42,0.22)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <Image
                    src={product.images[0] || "/placeholder.jpg"}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                    최대 {discountRate}% 할인
                  </div>
                </div>

                <div className="space-y-3 p-5">
                  <p className="line-clamp-2 text-base font-semibold text-slate-950">{name}</p>
                  <div className="flex items-end gap-2">
                    <span className="text-xl font-black text-[color:var(--link-accent)]">
                      {formatPrice(salePrice, "ko")}원
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(product.price, "ko")}원
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
