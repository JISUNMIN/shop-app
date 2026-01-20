import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCode, hashCode } from "@/lib/otp";

const EXPIRES_SEC = 180;
const RESEND_COOLDOWN_SEC = 30;
const MAX_RESEND = 10;

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ ok: false, messageKey: "auth.serverError.phoneInvalid" }, { status: 400 });
    }

    const now = new Date();

    const existing = await prisma.phoneVerification.findUnique({
      where: { phone },
    });

    if (existing) {
      if (existing.verifiedAt) {
        return NextResponse.json({ ok: true, alreadyVerified: true }, { status: 200 });
      }

      const diffSec = Math.floor((now.getTime() - existing.lastSentAt.getTime()) / 1000);
      if (diffSec < RESEND_COOLDOWN_SEC) {
        return NextResponse.json(
          {
            ok: false,
            messageKey: "auth.serverError.phoneResendCooldown",
            retryAfterSec:  RESEND_COOLDOWN_SEC - diffSec ,
          },
          { status: 429 }
        );
      }

      if (existing.resendCount >= MAX_RESEND) {
        return NextResponse.json(
          { ok: false, messageKey: "auth.serverError.phoneTooManyResendRequests" },
          { status: 429 }
        );
      }
    }

    const code = generateCode();
    const codeHash = hashCode(phone, code);
    const expiresAt = new Date(now.getTime() + EXPIRES_SEC * 1000);

    await prisma.phoneVerification.upsert({
      where: { phone },
      create: {
        phone,
        codeHash,
        expiresAt,
        attempts: 0,
        resendCount: 0,
        lastSentAt: now,
        verifiedAt: null,
      },
      update: {
        codeHash,
        expiresAt,
        attempts: 0,
        resendCount: { increment: 1 },
        lastSentAt: now,
        verifiedAt: null,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        expiresInSec: EXPIRES_SEC,
        code: code,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ ok: false, messageKey: "auth.serverError.serverError" }, { status: 500 });
  }
}
