import { Prisma } from "@prisma/client";
import { getOrderTransitionRequirement, isValidOrderStatusTransition } from "@/utils/orders";
import type { OrderEventType, OrderStatus } from "@/types";

export function buildTransitionData(nextStatus: OrderStatus, now: Date): Prisma.OrderUpdateInput {
  switch (nextStatus) {
    case "PAID":
      return {
        status: nextStatus,
        paidAt: now,
      };
    case "SHIPPING":
      return {
        status: nextStatus,
      };
    case "DELIVERED":
      return {
        status: nextStatus,
        deliveredAt: now,
      };
    case "CANCEL_REQUESTED":
      return {
        status: nextStatus,
        cancelRequestedAt: now,
      };
    case "REFUNDED":
      return {
        status: nextStatus,
        refundedAt: now,
      };
    case "RETURN_REQUESTED":
      return {
        status: nextStatus,
        returnRequestedAt: now,
      };
    case "RETURNED":
      return {
        status: nextStatus,
        returnedAt: now,
      };
    default:
      return {
        status: nextStatus,
      };
  }
}

export function getOrderEventTypeForStatus(nextStatus: OrderStatus): OrderEventType {
  switch (nextStatus) {
    case "PAID":
      return "PAYMENT_CONFIRMED" as OrderEventType;
    case "SHIPPING":
      return "SHIPPING_STARTED" as OrderEventType;
    case "DELIVERED":
      return "DELIVERED" as OrderEventType;
    case "REFUNDED":
      return "REFUNDED" as OrderEventType;
    case "RETURNED":
      return "RETURNED" as OrderEventType;
    case "CANCEL_REQUESTED":
      return "CANCEL_REQUESTED" as OrderEventType;
    case "RETURN_REQUESTED":
      return "RETURN_REQUESTED" as OrderEventType;
    default:
      return "STATUS_CHANGED" as OrderEventType;
  }
}

export function hasShippingInfo(input: {
  carrier?: string | null;
  trackingNumber?: string | null;
}) {
  return Boolean(input.carrier && input.trackingNumber);
}

export function validateOrderPatchInput(input: {
  currentStatus: OrderStatus;
  nextStatus?: OrderStatus;
  currentCarrier?: string | null;
  currentTrackingNumber?: string | null;
  carrier?: string | null;
  trackingNumber?: string | null;
  note?: string | null;
}) {
  const {
    currentStatus,
    nextStatus,
    currentCarrier,
    currentTrackingNumber,
    carrier,
    trackingNumber,
    note,
  } = input;

  if (!nextStatus) return null;

  if (!isValidOrderStatusTransition(currentStatus, nextStatus)) {
    return "Invalid status transition";
  }

  const requirement = getOrderTransitionRequirement(nextStatus);
  const mergedShippingState = {
    carrier: carrier !== undefined ? carrier : currentCarrier,
    trackingNumber: trackingNumber !== undefined ? trackingNumber : currentTrackingNumber,
  };

  if (requirement.requiresShipping && !hasShippingInfo(mergedShippingState)) {
    return "Shipping carrier and tracking number are required";
  }

  if (requirement.requiresNote && !note?.trim()) {
    return "Operator note is required for this transition";
  }

  return null;
}

export function buildShippingUpdateNote(input: {
  carrier?: string | null;
  trackingNumber?: string | null;
  fallbackCarrier?: string | null;
  fallbackTrackingNumber?: string | null;
}) {
  const carrier = input.carrier || input.fallbackCarrier || "-";
  const trackingNumber = input.trackingNumber || input.fallbackTrackingNumber || "-";
  return `Shipping info updated: ${carrier} / ${trackingNumber}`;
}
