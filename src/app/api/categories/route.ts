import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CategoryText = { en: string; ko: string };

export async function GET() {
  try {
    const rows = await prisma.product.findMany({
      select: { category: true },
    });

    const map = new Map<string, CategoryText>();

    for (const row of rows) {
      const c = row.category as unknown as CategoryText | null | undefined;
      if (!c?.en || !c?.ko) continue;
      map.set(c.en, c); 
    }

    const categories = Array.from(map.values()).sort((a, b) => a.en.localeCompare(b.en));

    return NextResponse.json(
      { categories },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("Categories API Error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
