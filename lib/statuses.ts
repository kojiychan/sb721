export const ORDER_STATUSES = [
  "Order Received",
  "Scheduling",
  "Scheduled",
  "Inspection Completed",
  "Report In Progress",
  "Report Ready",
  "Completed",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ACTIVE_STATUSES = ORDER_STATUSES.filter(
  (status) => status !== "Completed" && status !== "Cancelled",
);

export function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}

export function statusStep(status: string) {
  return ORDER_STATUSES.findIndex((item) => item === status);
}
