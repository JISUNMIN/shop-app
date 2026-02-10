// src/app/api/products/suggest/route.ts
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
    const qRaw = normalize(searchParams.get("searchText") || "");
    const locale = searchParams.get("locale") || "ko";

    if (!qRaw) return NextResponse.json({ data: [] });

    const qNoSpace = qRaw.replace(/\s+/g, "");
    const like = `%${qNoSpace}%`;
    const limit = Math.min(10, Math.max(1, parseInt(searchParams.get("limit") || "8", 10)));

    const table = Prisma.raw(PRODUCT_TABLE);

    const rows = await prisma.$queryRaw<any[]>`
      SELECT
        id,
        (name->>${locale}) as label
      FROM ${table}
      WHERE
        (
          ${stripSpaceSql(Prisma.sql`name->>'ko'`)} ILIKE ${like}
          OR ${stripSpaceSql(Prisma.sql`name->>'en'`)} ILIKE ${like}
          OR ${stripSpaceSql(Prisma.sql`description->>'ko'`)} ILIKE ${like}
          OR ${stripSpaceSql(Prisma.sql`description->>'en'`)} ILIKE ${like}
        )
        AND (name->>${locale}) IS NOT NULL
      ORDER BY
        CASE WHEN ${stripSpaceSql(Prisma.sql`name->>${locale}`)} ILIKE ${qNoSpace} || '%' THEN 0 ELSE 1 END,
        "createdAt" DESC
      LIMIT ${limit};
    `;

    const data = rows
      .map((r) => ({
        id: r.id,
        label: String(r.label || "").trim(),
        value: String(r.label || "").trim(),
      }))
      .filter((x) => x.label);

    return NextResponse.json({ data });
  } catch (e) {
    console.error("Products Suggest API Error:", e);
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}
