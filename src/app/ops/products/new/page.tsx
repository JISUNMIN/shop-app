import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import OpsProductCreateClient from "./OpsProductCreateClient";
import type { LocalizedText } from "@/types";

type ProductSummary = {
  id: number;
  name: LocalizedText;
  category: LocalizedText | null;
  price: number;
  stock: number;
};

const toLocalizedText = (value: unknown): LocalizedText => {
  const source = (value ?? {}) as { ko?: unknown; en?: unknown };

  return {
    ko: typeof source.ko === "string" ? source.ko : "",
    en: typeof source.en === "string" ? source.en : "",
  };
};

export default async function OpsProductCreatePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=%2Fops%2Fproducts%2Fnew");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/ops-access");
  }

  const recentProducts = await prisma.product.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      category: true,
      price: true,
      stock: true,
    },
  });

  const normalizedRecentProducts: ProductSummary[] = recentProducts.map((product) => ({
    id: product.id,
    name: toLocalizedText(product.name),
    category: product.category ? toLocalizedText(product.category) : null,
    price: product.price,
    stock: product.stock,
  }));

  return <OpsProductCreateClient recentProducts={normalizedRecentProducts} />;
}
