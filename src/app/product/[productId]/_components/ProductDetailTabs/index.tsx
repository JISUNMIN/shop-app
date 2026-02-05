"use client";

import { useState } from "react";
import TabsNav, { TabKey } from "./TabsNav";
import TabDetail from "./TabDetail";
import TabSpecs from "./TabSpecs";
import TabGuide from "./TabGuide";
import TabShipping from "./TabShipping";
import useProducts from "@/hooks/useProducts";
import ProductDetailTabsSkeleton from "./ProductDetailTabsSkeleton";

export default function ProductDetailTabs({ productId }: { productId: string }) {
  const [activeTab, setActiveTab] = useState<TabKey>("detail");

  const { detailData, isDetailLoading } = useProducts(undefined, Number(productId));

  if (isDetailLoading || !detailData) return <ProductDetailTabsSkeleton />;

  return (
    <section className="mt-12">
      <TabsNav activeTab={activeTab} onChange={setActiveTab} />

      <div className="mb-12">
        {activeTab === "detail" && <TabDetail product={detailData} />}
        {activeTab === "specs" && <TabSpecs product={detailData} />}
        {activeTab === "guide" && <TabGuide product={detailData} />}
        {activeTab === "shipping" && <TabShipping />}
      </div>
    </section>
  );
}
