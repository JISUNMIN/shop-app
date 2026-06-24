-- CreateEnum
CREATE TYPE "OrderEventType" AS ENUM (
  'ORDER_CREATED',
  'STATUS_CHANGED',
  'CANCEL_REQUESTED',
  'REFUNDED',
  'RETURN_REQUESTED',
  'RETURNED',
  'PAYMENT_CONFIRMED',
  'SHIPPING_STARTED',
  'DELIVERED'
);

-- CreateTable
CREATE TABLE "order_events" (
  "id" SERIAL NOT NULL,
  "orderId" INTEGER NOT NULL,
  "eventType" "OrderEventType" NOT NULL,
  "fromStatus" "OrderStatus",
  "toStatus" "OrderStatus" NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "order_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "order_events_orderId_createdAt_idx" ON "order_events"("orderId", "createdAt");

-- AddForeignKey
ALTER TABLE "order_events"
ADD CONSTRAINT "order_events_orderId_fkey"
FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
