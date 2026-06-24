import { Prisma, PrismaClient } from "@prisma/client";
import type { OrderEventType, OrderStatus } from "@/types";

type Db = Prisma.TransactionClient | PrismaClient;

export async function appendOrderEvent(
  db: Db,
  {
    orderId,
    eventType,
    fromStatus,
    toStatus,
    note,
  }: {
    orderId: number;
    eventType: OrderEventType;
    fromStatus?: OrderStatus | null;
    toStatus: OrderStatus;
    note?: string | null;
  },
) {
  return db.orderEvent.create({
    data: {
      orderId,
      eventType,
      fromStatus: fromStatus ?? null,
      toStatus,
      note: note ?? null,
    },
  });
}
