import { prisma } from "@/lib/prisma";
import type { OperatorOrdersDashboard, OrderPriority, OrderStatus } from "@/types";

const STATUS_ORDER: OrderStatus[] = [
  "PENDING" as OrderStatus,
  "PAID" as OrderStatus,
  "SHIPPING" as OrderStatus,
  "DELIVERED" as OrderStatus,
  "CANCEL_REQUESTED" as OrderStatus,
  "REFUNDED" as OrderStatus,
  "RETURN_REQUESTED" as OrderStatus,
  "RETURNED" as OrderStatus,
];

export function buildOpsOrderWhere(input: {
  status?: string | null;
  search?: string | null;
}) {
  const { status, search } = input;

  return {
    ...(status && status !== "all" ? { status: status as OrderStatus } : {}),
    ...(search
      ? {
          OR: [
            { shipName: { contains: search, mode: "insensitive" as const } },
            { shipPhone: { contains: search, mode: "insensitive" as const } },
            { trackingNumber: { contains: search, mode: "insensitive" as const } },
            { carrier: { contains: search, mode: "insensitive" as const } },
            { user: { userId: { contains: search, mode: "insensitive" as const } } },
            { user: { name: { contains: search, mode: "insensitive" as const } } },
            ...(Number.isFinite(Number(search)) ? [{ id: Number(search) }] : []),
          ],
        }
      : {}),
  };
}

export async function getOpsOrdersDashboard(input: {
  status?: string | null;
  search?: string | null;
}): Promise<OperatorOrdersDashboard> {
  const where = buildOpsOrderWhere(input);

  const [rawOrders, statusGroups, todayOrders, delayedShippingOrders] = await Promise.all([
    (prisma.order.findMany as (...args: unknown[]) => Promise<unknown[]>)({
      where,
      orderBy: [{ createdAt: "desc" }],
      take: 40,
      select: {
        id: true,
        status: true,
        totalAmount: true,
        discountAmount: true,
        paymentMethod: true,
        carrier: true,
        trackingNumber: true,
        assignedOperator: true,
        priority: true,
        slaDueAt: true,
        internalMemo: true,
        createdAt: true,
        updatedAt: true,
        paidAt: true,
        deliveredAt: true,
        cancelRequestedAt: true,
        returnRequestedAt: true,
        shipName: true,
        shipPhone: true,
        user: {
          select: {
            id: true,
            name: true,
            userId: true,
            phone: true,
            email: true,
          },
        },
        orderItems: {
          select: {
            id: true,
            orderId: true,
            productId: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                stock: true,
              },
            },
          },
        },
        orderEvents: {
          take: 5,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          select: {
            id: true,
            orderId: true,
            eventType: true,
            fromStatus: true,
            toStatus: true,
            note: true,
            createdAt: true,
          },
        },
      },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    }),
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.order.count({
      where: {
        status: "PAID",
        paidAt: {
          lte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        },
      },
    }),
  ]);

  const orders = rawOrders as Array<{
    id: number;
    status: OrderStatus;
    totalAmount: number;
    discountAmount: number;
    paymentMethod?: string | null;
    carrier?: string | null;
    trackingNumber?: string | null;
    assignedOperator?: string | null;
    priority: OrderPriority;
    slaDueAt?: string | Date | null;
    internalMemo?: string | null;
    createdAt: string | Date;
    updatedAt?: string | Date;
    paidAt?: string | Date | null;
    deliveredAt?: string | Date | null;
    cancelRequestedAt?: string | Date | null;
    returnRequestedAt?: string | Date | null;
    shipName: string;
    shipPhone: string;
    user: {
      id: string;
      name?: string | null;
      userId?: string | null;
      phone?: string | null;
      email?: string | null;
    };
    orderItems: unknown[];
    orderEvents?: Array<{ id: number }>;
  }>;

  const counts = new Map<OrderStatus, number>();
  statusGroups.forEach((group) => {
    counts.set(group.status as OrderStatus, group._count._all);
  });

  const statusCounts = STATUS_ORDER.map((orderStatus) => ({
    status: orderStatus,
    count: counts.get(orderStatus) ?? 0,
  }));

  const urgentOrdersCount = orders.filter((order) => order.priority === "URGENT").length;
  const overdueOrdersCount = orders.filter(
    (order) => order.slaDueAt && new Date(order.slaDueAt).getTime() < Date.now(),
  ).length;
  const unassignedOrdersCount = orders.filter((order) => !order.assignedOperator).length;

  const dashboard = {
    summary: {
      totalOrders: statusCounts.reduce((sum, item) => sum + item.count, 0),
      paidOrders: counts.get("PAID" as OrderStatus) ?? 0,
      shippingOrders: counts.get("SHIPPING" as OrderStatus) ?? 0,
      claimOrders:
        (counts.get("CANCEL_REQUESTED" as OrderStatus) ?? 0) +
        (counts.get("RETURN_REQUESTED" as OrderStatus) ?? 0),
      pendingOrders: counts.get("PENDING" as OrderStatus) ?? 0,
      todayOrders,
      delayedShippingOrders,
      urgentOrdersCount,
      overdueOrdersCount,
      unassignedOrdersCount,
    },
    statusCounts,
    orders,
    generatedAt: new Date().toISOString(),
  };

  return JSON.parse(JSON.stringify(dashboard)) as OperatorOrdersDashboard;
}

export function getOpsOrdersStreamFingerprint(dashboard: OperatorOrdersDashboard) {
  return JSON.stringify({
    summary: dashboard.summary,
    statusCounts: dashboard.statusCounts,
    orderMarkers: dashboard.orders.map((order) => ({
      id: order.id,
      status: order.status,
      updatedAt: order.updatedAt,
      carrier: order.carrier,
      trackingNumber: order.trackingNumber,
      assignedOperator: order.assignedOperator,
      priority: order.priority,
      slaDueAt: order.slaDueAt,
      lastEventId: order.orderEvents?.[0]?.id ?? null,
    })),
  });
}

export const ORDER_PRIORITY_BADGE_CLASS: Record<OrderPriority, string> = {
  LOW: "bg-slate-100 text-slate-700",
  NORMAL: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
};

export function getOrderPriorityWeight(priority: OrderPriority) {
  switch (priority) {
    case "URGENT":
      return 4;
    case "HIGH":
      return 3;
    case "NORMAL":
      return 2;
    case "LOW":
    default:
      return 1;
  }
}

export function getSlaStatus(slaDueAt?: string | null) {
  if (!slaDueAt) return "unset" as const;

  const diff = new Date(slaDueAt).getTime() - Date.now();
  if (diff < 0) return "overdue" as const;
  if (diff <= 1000 * 60 * 60 * 12) return "risk" as const;
  return "safe" as const;
}

export const ORDER_SLA_BADGE_CLASS = {
  unset: "bg-slate-100 text-slate-600",
  safe: "bg-emerald-100 text-emerald-700",
  risk: "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-700",
} as const;
