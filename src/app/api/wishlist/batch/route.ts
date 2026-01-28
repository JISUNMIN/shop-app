import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth"; 

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { productIds } = await req.json();

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return NextResponse.json({ message: "No productIds" }, { status: 400 });
  }

  await prisma.wishlistItem.createMany({
    data: productIds.map((id: number) => ({
      userId: session.user.id,
      productId: id,
    })),
    skipDuplicates: true,
  });

  return NextResponse.json({ ok: true });
}
