// src/app/product/[productId]/page.tsx
import ProductShell from "./_components/ProductShell";

export default function Page({ params }: { params: { productId: string } }) {
  return <ProductShell productId={Number(params.productId)} />;
}
