enum OrderPaymentsStatus {
  PENDING = "PENDING",
  DENIED = "DENIED",
  APPROVED = "APPROVED"
}

export function isValidOrderPaymentStatus(paymentStatus: string): paymentStatus is OrderPaymentsStatus {
  return Object.keys(OrderPaymentsStatus).includes(paymentStatus as OrderPaymentsStatus);
}

export default OrderPaymentsStatus;
