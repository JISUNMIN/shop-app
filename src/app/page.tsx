import { Suspense } from "react";
import ProductList from "@/app/product/ProductList";
import BannerCarousel, { Banner } from "@/components/common/BannerCarousel";
import HomeCapabilityShowcase from "@/components/common/HomeCapabilityShowcase";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const banners = [
  { src: "/banners/banner1.png", action: "scroll", to: "product-catalog" },
  { src: "/banners/banner2.png", action: "route", to: "/special-offers" },
  { src: "/banners/banner3.png", action: "route", to: "/rental-service" },
] satisfies Banner[];

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="-mx-4 bg-white sm:-mx-6 lg:-mx-8">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <BannerCarousel banners={banners} />
        </div>
      </div>

      <div className="-mx-4 bg-white sm:-mx-6 lg:-mx-8">
        <div className="mx-auto w-full max-w-6xl px-4 pt-4 pb-12 sm:px-6 sm:pt-5 sm:pb-14 lg:px-8">
          <HomeCapabilityShowcase />
          <ProductList />
        </div>
      </div>
    </Suspense>
  );
}
