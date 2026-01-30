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
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
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

    const count = await prisma.address.count({ where: { userId } });
    if (count >= 5) {
      return NextResponse.json({ error: "Maximum address limit reached" }, { status: 400 });
    }

    const body = await request.json();
    const { label, name, phone, zip, address1, address2, memo, isDefault } = body;

    if (isDefault === true) {
      const address = await prisma.$transaction(async (tx) => {
        // 새 주소가 기본배송지면 기존 기본배송지 전부 해제

        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });

        return tx.address.create({
          data: {
            userId,
            label,
            name,
            phone,
            zip,
            address1,
            address2,
            memo,
            isDefault: true,
          },
        });
      });
      return NextResponse.json(address);
    }
    const address = await prisma.address.create({
      data: {
        userId,
        label,
        name,
        phone,
        zip,
        address1,
        address2,
        memo,
        isDefault: false,
      },
    });
    return NextResponse.json(address);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to add to address", detail: String(e) },
      { status: 500 },
    );
  }
}
