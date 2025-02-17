export default class PaymentDTO {
  public paymentId?: number;
  public orderId?: number;
  public paymentStatus?: string;
  public timestamp?: Date;

  constructor({ orderId, paymentId, paymentStatus, timestamp }: { orderId?: number; paymentId?: number; paymentStatus?: string; timestamp?: Date }) {
    this.orderId = orderId;
    this.paymentId = paymentId;
    this.paymentStatus = paymentStatus;
    this.timestamp = timestamp;
  }
}
