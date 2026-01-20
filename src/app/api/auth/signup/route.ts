import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { name, userId, mobileNumber, email, password } = await request.json();
    const normalizedEmail = typeof email === "string" ? email.trim() : "";
    const emailOrNull = normalizedEmail.length > 0 ? normalizedEmail : null;

    if (!password) {
      return NextResponse.json({ error: "password required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { userId } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    if (emailOrNull) {
      const existingEmail = await prisma.user.findUnique({ where: { email: emailOrNull } });
      if (existingEmail) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        userId,
        name: name ?? null,
        phone: mobileNumber,
        email: emailOrNull,
        password: hashed,
      },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
