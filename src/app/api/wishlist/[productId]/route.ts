import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// 위시리스트 삭제
export async function DELETE(_request: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = Number(params.productId);

    if (!Number.isFinite(productId)) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    await prisma.wishlistItem.deleteMany({
      where: { userId, productId },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 });
  }
}
