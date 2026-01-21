"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export type Banner =
  | { src: string; action?: undefined; to?: never }
  | { src: string; action: "route"; to: string }
  | { src: string; action: "scroll"; to: string };

type BannerCarouselProps = {
  banners: Banner[];
};

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const router = useRouter();
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  const handleBannerClick = (banner: Banner) => {
    if (!banner.action) return;

    if (banner.action === "route") {
      router.push(banner.to);
      return;
    }

    // scroll
    const el = document.getElementById(banner.to);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Carousel
      className="w-full"
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={() => plugin.current.play()}
    >
      <CarouselContent>
        {banners.map((banner, idx) => {
          const clickable = !!banner.action;
          return (
            <CarouselItem key={idx}>
              <div
                onClick={clickable ? () => handleBannerClick(banner) : undefined}
                tabIndex={clickable ? 0 : undefined}
                className={`relative w-full h-[450px] overflow-hidden rounded-xl ${
                  clickable ? "cursor-pointer" : ""
                }`}
              >
                <Image
                  src={banner.src}
                  alt={`banner_${idx + 1}`}
                  fill
                  sizes="100vw"
                  priority={idx === 0}
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
