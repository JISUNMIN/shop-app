import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashCode, safeEqual } from "@/lib/otp";

const MAX_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json(
        { ok: false, messageKey: "auth.serverError.phoneOrCodeInvalid" },
        { status: 400 }
      );
    }

    const row = await prisma.phoneVerification.findUnique({
      where: { phone },
    });

    if (!row) {
      return NextResponse.json(
        { ok: false, messageKey: "auth.serverError.phoneNoVerificationSession" },
        { status: 400 }
      );
    }

    if (row.verifiedAt) {
      return NextResponse.json({ ok: true, alreadyVerified: true }, { status: 200 });
    }

    const now = new Date();

    if (row.expiresAt.getTime() < now.getTime()) {
      return NextResponse.json(
        { ok: false, messageKey: "auth.serverError.phoneCodeExpired" },
        { status: 400 }
      );
    }

    if (row.attempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { ok: false, messageKey: "auth.serverError.phoneTooManyAttempts" },
        { status: 429 }
      );
    }

    const incomingHash = hashCode(phone, code);
    const matched = safeEqual(row.codeHash, incomingHash);

    if (!matched) {
      await prisma.phoneVerification.update({
        where: { phone },
        data: { attempts: { increment: 1 } },
      });

      return NextResponse.json(
        { ok: false, messageKey: "auth.serverError.phoneInvalidCode" },
        { status: 400 }
      );
    }

    await prisma.phoneVerification.update({
      where: { phone },
      data: {
        verifiedAt: now,
      },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch  {
    return NextResponse.json(
      { ok: false, messageKey: "auth.serverError.serverError" },
      { status: 500 }
    );
  }
}
