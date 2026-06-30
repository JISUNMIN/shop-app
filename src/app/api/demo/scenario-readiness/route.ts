import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

const STATUS_ORDER: OrderStatus[] = [
  "PENDING",
  "PAID",
  "SHIPPING",
  "DELIVERED",
  "CANCEL_REQUESTED",
  "REFUNDED",
  "RETURN_REQUESTED",
  "RETURNED",
];

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unavailable" }, { status: 404 });
  }

  const orders = await prisma.order.findMany({
    select: {
      id: true,
      status: true,
      trackingNumber: true,
      carrier: true,
      orderItems: {
        take: 1,
        select: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  const statusSummary = STATUS_ORDER.map((status) => {
    const matched = orders.filter((order) => order.status === status);
    const sample = matched[0];

    return {
      status,
      count: matched.length,
      sampleOrderId: sample?.id ?? null,
      sampleProductName: sample?.orderItems[0]?.product.name ?? null,
    };
  });

  const trackingReadyOrder =
    orders.find((order) => order.status === "SHIPPING" && order.trackingNumber && order.carrier) ??
    null;

  const deliveredOrder = orders.find((order) => order.status === "DELIVERED") ?? null;
  const claimOrder =
    orders.find(
      (order) =>
        order.status === "CANCEL_REQUESTED" ||
        order.status === "REFUNDED" ||
        order.status === "RETURN_REQUESTED" ||
        order.status === "RETURNED",
    ) ?? null;

  return NextResponse.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    summary: {
      totalOrders: orders.length,
      trackingReadyOrderId: trackingReadyOrder?.id ?? null,
      deliveredOrderId: deliveredOrder?.id ?? null,
      claimOrderId: claimOrder?.id ?? null,
    },
    statuses: statusSummary,
  });
}
