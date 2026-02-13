import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, phone } = await request.json();

    if (!userId || !phone) {
      return NextResponse.json(
        { errorKey: "auth.serverError.userIdAndPhoneRequired" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: { userId, phone },
    });

    if (!user) {
      return NextResponse.json({ errorKey: "auth.serverError.noUserMatched" }, { status: 404 });
    }

    return NextResponse.json({ oK: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
