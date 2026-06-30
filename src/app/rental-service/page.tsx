import { prisma } from "@/lib/prisma";
import RentalServiceClient from "./RentalServiceClient";

export default async function RentalServicePage() {
  const products = await prisma.product.findMany({
    where: {
      stock: {
        gt: 0,
      },
    },
    orderBy: [{ price: "desc" }, { createdAt: "desc" }],
    take: 6,
  });

  const rentalProducts = products.map((product) => ({
    id: product.id,
    name: (product.name as { ko?: string; en?: string }).ko ?? "상품",
    category: ((product.category as { ko?: string; en?: string } | null)?.ko ?? "로봇"),
    image: product.images[0] ?? "/placeholder.jpg",
    price: product.price,
  }));

  return <RentalServiceClient products={rentalProducts} />;
}
