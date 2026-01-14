import { Suspense } from "react";
import ProductList from "@/app/product/ProductList";

export default function Page() {
  return (
    <Suspense fallback={<div className="container py-8">Loading...</div>}>
      <ProductList />;
    </Suspense>
  );
}
