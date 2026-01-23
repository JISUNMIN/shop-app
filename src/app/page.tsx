import { Suspense } from "react";
import ProductList from "@/app/product/ProductList";
import BannerCarousel, { Banner } from "@/components/common/BannerCarousel";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const banners = [
  { src: "/banners/banner1.png", action: "route", to: "/signup" },
  { src: "/banners/banner2.png", action: "route", to: "/product/15" },
  { src: "/banners/banner3.png" },
] satisfies Banner[];



export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner/>}>
      <BannerCarousel banners={banners} />
      <ProductList />
    </Suspense>
  );
}
