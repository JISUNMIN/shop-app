import { Suspense } from "react";
import ProductList from "@/app/product/ProductList";
import BannerCarousel, { Banner } from "@/components/common/BannerCarousel";

const banners = [
  { src: "/banners/banner1.png", action: "route", to: "/signup" },
  { src: "/banners/banner2.png", action: "route", to: "/product/15" },
  { src: "/banners/banner3.png" },
] satisfies Banner[];

export default function Page() {
  return (
    <Suspense fallback={<div className="container py-8">Loading...</div>}>
      <BannerCarousel banners={banners} />
      <ProductList />
    </Suspense>
  );
}
