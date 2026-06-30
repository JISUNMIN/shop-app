"use client";

import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export type Banner =
  | { src: string; action?: undefined; to?: never }
  | { src: string; action: "route"; to: string }
  | { src: string; action: "scroll"; to: string };

type BannerCarouselProps = {
  banners: Banner[];
};

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const plugin = useRef(Autoplay({ delay: 4500, stopOnInteraction: false }));

  const handleBannerClick = (banner: Banner) => {
    if (!banner.action) return;

    if (banner.action === "route") {
      router.push(banner.to);
      return;
    }

    const el = document.getElementById(banner.to);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Carousel
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={() => plugin.current.play()}
      className="w-full"
    >
      <CarouselContent>
        {banners.map((banner, idx) => {
          const primaryHref =
            banner.action === "route"
              ? banner.to
              : banner.action === "scroll"
                ? `#${banner.to}`
              : idx === 0
                ? "/?sort=newest"
                : idx === 1
                  ? "/special-offers"
                  : "/rental-service";
          const secondaryHref =
            idx === 0 ? "/shopping-info" : idx === 1 ? "/rental-service" : "/support";
          const primaryLabel =
            idx === 0 ? t("homeHero.primaryCta") : idx === 1 ? "특가 보기" : "렌탈 보기";
          const secondaryLabel =
            idx === 0 ? t("homeHero.secondaryCta") : idx === 1 ? "렌탈 안내" : "상담 문의";

          return (
            <CarouselItem key={banner.src}>
              <section
                className="group relative overflow-hidden rounded-[2rem] shadow-[0_26px_70px_-34px_rgba(12,27,46,0.72)]"
                style={{
                  background:
                    "linear-gradient(135deg, #0c1b2e 0%, #143252 55%, #2d6ea8 100%)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at top right, rgba(255,255,255,0.16), transparent 26%)",
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at bottom left, rgba(94,176,255,0.18), transparent 30%)",
                  }}
                />

                <div className="relative flex min-h-[320px] items-center px-6 py-8 md:min-h-[400px] md:px-10 md:py-10">
                  <div className="max-w-2xl text-white">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9dd0ff]">
                      {t("homeHero.eyebrow")}
                    </p>

                    <h1 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] md:text-5xl">
                      {idx === 0 ? t("homeHero.title") : t(`homeHero.slides.slide${idx + 1}.title`)}
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-white/72 md:text-base">
                      {idx === 0
                        ? t("homeHero.description")
                        : t(`homeHero.slides.slide${idx + 1}.description`)}
                    </p>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={primaryHref}
                        onClick={(e) => {
                          if (banner.action === "scroll") {
                            e.preventDefault();
                            handleBannerClick(banner);
                          }
                        }}
                      >
                        <Button
                          size="lg"
                          className="w-full border-0 bg-[#378add] text-white hover:bg-[#2f79c4] sm:w-auto"
                        >
                          {primaryLabel}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>

                      <Link href={secondaryHref}>
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full border-white/15 bg-white/8 text-white/85 hover:bg-white/12 hover:text-white sm:w-auto"
                        >
                          {secondaryLabel}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      <CarouselPrevious className="left-4 hidden border-white/10 bg-white/92 text-slate-900 hover:bg-white lg:flex" />
      <CarouselNext className="right-4 hidden border-white/10 bg-white/92 text-slate-900 hover:bg-white lg:flex" />
    </Carousel>
  );
}
