// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const PRODUCT_TABLE = "products";

const normalize = (s: string) => s.trim().replace(/\s+/g, " ");

const stripSpaceSql = (expr: Prisma.Sql) =>
  Prisma.sql`regexp_replace(COALESCE(${expr}, ''), '\\s+', '', 'g')`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const searchRaw = normalize(searchParams.get("search") || "");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const sort = searchParams.get("sort") || "newest";
    const categoryRaw = normalize(searchParams.get("category") || "");
    const locale = searchParams.get("locale");

    const limit = 10;
    const skip = (page - 1) * limit;

    let orderBySql = Prisma.sql`"createdAt" DESC`;
    switch (sort) {
      case "oldest":
        orderBySql = Prisma.sql`"createdAt" ASC`;
        break;
      case "price_asc":
        orderBySql = Prisma.sql`price ASC`;
        break;
      case "price_desc":
        orderBySql = Prisma.sql`price DESC`;
        break;
      case "name":
        orderBySql = Prisma.sql`(name->>${locale}) ASC`;
        break;
      default:
        orderBySql = Prisma.sql`"createdAt" DESC`;
        break;
    }

    const conditions: Prisma.Sql[] = [];

    if (searchRaw) {
      const qNoSpace = searchRaw.replace(/\s+/g, "");
      const like = `%${qNoSpace}%`;

      conditions.push(Prisma.sql`
        (
          ${stripSpaceSql(Prisma.sql`name->>'ko'`)} ILIKE ${like}
          OR ${stripSpaceSql(Prisma.sql`description->>'ko'`)} ILIKE ${like}
          OR ${stripSpaceSql(Prisma.sql`name->>'en'`)} ILIKE ${like}
          OR ${stripSpaceSql(Prisma.sql`description->>'en'`)} ILIKE ${like}
        )
      `);
    }

    if (categoryRaw) {
      const categoryList = categoryRaw
        .split(",")
        .map((c) => normalize(c))
        .filter(Boolean);

      if (categoryList.length > 0) {
        const categoryOr = Prisma.join(
          categoryList.map((c) => Prisma.sql`(category->>'en' = ${c} OR category->>'ko' = ${c})`),
          " OR ",
        );
        conditions.push(Prisma.sql`(${categoryOr})`);
      }
    }

    const whereSql =
      conditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}` : Prisma.empty;

    const table = Prisma.raw(PRODUCT_TABLE);

    const [products, totalRes] = await Promise.all([
      prisma.$queryRaw<any[]>`
        SELECT *
        FROM ${table}
        ${whereSql}
        ORDER BY ${orderBySql}
        LIMIT ${limit} OFFSET ${skip};
      `,
      prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)::bigint as count
        FROM ${table}
        ${whereSql};
      `,
    ]);

    const total = Number(totalRes[0]?.count ?? 0);
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
