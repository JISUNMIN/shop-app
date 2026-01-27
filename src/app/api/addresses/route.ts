// src/app/api/addresses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// 배송지 조회
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")?.trim();

    const addressList = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(addressList);
  } catch {
    return NextResponse.json({ error: "Failed to fetch address" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { label, name, phone, zip, address1, address2, memo, isDefault } = body;

    const address = await prisma.address.create({
      data: { userId, label, name, phone, zip, address1, address2, memo, isDefault },
    });

    return NextResponse.json(address);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to add to address", detail: String(e) },
      { status: 500 },
    );
  }
}
