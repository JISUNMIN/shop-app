import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// 위시리스트 조회
export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { productId: true },
    });

    return NextResponse.json({ productIds: items.map((i) => i.productId) });
  } catch {
    return NextResponse.json({ error: "Failed to load wishlist" }, { status: 500 });
  }
}

// 위시리스트 추가
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const productId = Number(body.productId);

    if (!Number.isFinite(productId)) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    const item = await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId },
      update: {},
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 });
  }
}
