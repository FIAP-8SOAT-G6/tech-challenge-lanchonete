export enum OrderStatus {
  CREATED = "CREATED",
  PENDING_PAYMENT = "PENDING_PAYMENT",
  PAYED = "PAYED",
  RECEIVED = "RECEIVED",
  PREPARING = "PREPARING",
  DONE = "DONE",
  FINISHED = "FINISHED"
}

export function isValidOrderStatus(value: string): value is OrderStatus {
  return Object.values(OrderStatus).includes(value as OrderStatus);
}
