// src/app/api/addresses/[addressId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(_request: NextRequest, { params }: { params: { addressId: string } }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addressId = Number(params.addressId);
    if (!Number.isFinite(addressId)) {
      return NextResponse.json({ error: "Invalid addressId" }, { status: 400 });
    }

    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
      select: { id: true, isDefault: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.address.delete({
        where: { id: addressId },
      });

      if (existing.isDefault) {
        const next = await tx.address.findFirst({
          where: { userId },
          orderBy: { createdAt: "asc" },
          select: { id: true },
        });

        if (next) {
          await tx.address.update({
            where: { id: next.id },
            data: { isDefault: true },
          });
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to delete address", detail: String(e) },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { addressId: string } }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const addressId = Number(params.addressId);
    if (!Number.isFinite(addressId)) {
      return NextResponse.json({ error: "Invalid addressId" }, { status: 400 });
    }

    const { label, name, phone, zip, address1, address2, memo, isDefault } = await request.json();

    const data = {
      ...(label !== undefined && { label }),
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(zip !== undefined && { zip }),
      ...(address1 !== undefined && { address1 }),
      ...(address2 !== undefined && { address2 }),
      ...(memo !== undefined && { memo }),
      ...(isDefault !== undefined && { isDefault: Boolean(isDefault) }),
    };

    if (isDefault === true) {
      const updated = await prisma.$transaction(async (tx) => {
        await tx.address.updateMany({
          where: { userId, isDefault: true, id: { not: addressId } },
          data: { isDefault: false },
        });

        return tx.address.update({
          where: { id: addressId, userId },
          data: { ...data, isDefault: true },
        });
      });

      return NextResponse.json({ data: updated });
    }

    const updated = await prisma.address.update({
      where: { id: addressId, userId },
      data,
    });

    return NextResponse.json({ data: updated });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to edit address", detail: String(e) },
      { status: 500 },
    );
  }
}
