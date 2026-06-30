import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ReadinessCheck = {
  key: string;
  label: string;
  ok: boolean;
  detail: string;
};

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unavailable" }, { status: 404 });
  }

  const checks: ReadinessCheck[] = [];

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.push({
      key: "database",
      label: "Database connection",
      ok: true,
      detail: "Database connection is available.",
    });
  } catch (error) {
    checks.push({
      key: "database",
      label: "Database connection",
      ok: false,
      detail: `Database connection failed: ${String(error)}`,
    });

    return NextResponse.json({
      ok: false,
      generatedAt: new Date().toISOString(),
      checks,
    });
  }

  try {
    const adminUser = await prisma.user.findFirst({
      where: { userId: "ops_admin", role: "ADMIN" },
      select: { id: true, userId: true },
    });

    checks.push({
      key: "admin-account",
      label: "Admin account",
      ok: Boolean(adminUser),
      detail: adminUser
        ? `Admin account ${adminUser.userId} is ready.`
        : "ops_admin ADMIN account was not found.",
    });
  } catch (error) {
    checks.push({
      key: "admin-account",
      label: "Admin account",
      ok: false,
      detail: `Admin account check failed: ${String(error)}`,
    });
  }

  try {
    const [productCount, orderCount, orderEventCount] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.orderEvent.count(),
    ]);

    checks.push({
      key: "seed-data",
      label: "Seeded products and orders",
      ok: productCount > 0 && orderCount > 0,
      detail: `Products ${productCount}, Orders ${orderCount}, Events ${orderEventCount}`,
    });
  } catch (error) {
    checks.push({
      key: "seed-data",
      label: "Seeded products and orders",
      ok: false,
      detail: `Seed data check failed: ${String(error)}`,
    });
  }

  try {
    const sampleOrder = await prisma.order.findFirst({
      select: {
        id: true,
        assignedOperator: true,
        priority: true,
        slaDueAt: true,
        internalMemo: true,
      },
      orderBy: { createdAt: "desc" },
    });

    checks.push({
      key: "ops-metadata",
      label: "Ops metadata columns",
      ok: sampleOrder !== null,
      detail: sampleOrder
        ? `Latest order #${sampleOrder.id} can read operator metadata fields.`
        : "No order exists yet to verify operator metadata fields.",
    });
  } catch (error) {
    checks.push({
      key: "ops-metadata",
      label: "Ops metadata columns",
      ok: false,
      detail: `Ops metadata check failed: ${String(error)}`,
    });
  }

  return NextResponse.json({
    ok: checks.every((check) => check.ok),
    generatedAt: new Date().toISOString(),
    checks,
  });
}
