// /api/product/by-ids/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((v) => Number(v))
    .filter(Number.isFinite);

  if (ids.length === 0) return NextResponse.json({ items: [] });

  const items = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      price: true,
      images: true,
      name: true,
    },
  });

  return NextResponse.json({ items });
}
