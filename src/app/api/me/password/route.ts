import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ errorKey: "auth.serverError.unauthorized" }, { status: 401 });
    }

    if (session.user.provider !== "credentials") {
      return NextResponse.json(
        { errorKey: "mypage.password.serverError.socialNotAllowed" },
        { status: 403 },
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { errorKey: "mypage.password.serverError.missingFields" },
        { status: 400 },
      );
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json(
        { errorKey: "mypage.password.serverError.passwordTooShort" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user?.password) {
      return NextResponse.json(
        { errorKey: "mypage.password.serverError.noPasswordSet" },
        { status: 400 },
      );
    }

    const ok = await bcrypt.compare(currentPassword, user.password);

    if (!ok) {
      return NextResponse.json(
        { errorKey: "mypage.password.serverError.invalidCurrentPassword" },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { errorKey: "mypage.password.serverError.serverFail" },
      { status: 500 },
    );
  }
}
