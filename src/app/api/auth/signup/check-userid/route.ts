import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")?.trim();

    if (!userId) {
      return NextResponse.json(
        { ok: false, message: "userId required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { userId } });

    if (existing) {
      return NextResponse.json(
        { ok: true, available: false, message: "UserId already in use" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { ok: true, available: true },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Internal error" },
      { status: 500 }
    );
  }
}
