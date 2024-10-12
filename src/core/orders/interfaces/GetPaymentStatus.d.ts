export default interface GetPaymentStatus {
  getPaymentStatus(orderId: number): Promise<string>;
}
