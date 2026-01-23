// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const sort = searchParams.get("sort") || "newest";
    const category = searchParams.get("category") || "";

    const limit = 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};
    const and: Prisma.ProductWhereInput[] = [];

    // 검색 조건
    if (search) {
      and.push({
        OR: [
          { name: { path: ["ko"], string_contains: search } },
          { description: { path: ["ko"], string_contains: search } },
          { name: { path: ["en"], string_contains: search } },
          { description: { path: ["en"], string_contains: search } },
        ],
      });
    }

    if (category) {
      const categoryList = category
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      if (categoryList.length > 0) {
        and.push({
          OR: categoryList.flatMap((c) => [
            { category: { path: ["en"], equals: c } },
            { category: { path: ["ko"], equals: c } },
          ]),
        });
      }
    }

    if (and.length > 0) where.AND = and;

    // 정렬
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" }; // 기본값: 최신순
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "name":
        orderBy = { name: "asc" };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: products,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
