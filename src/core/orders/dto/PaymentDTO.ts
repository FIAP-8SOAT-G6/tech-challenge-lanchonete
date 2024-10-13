export default class PaymentDTO {
    public orderId?: number;
    public paymentStatus?: string;
    public timestamp?: Date;
    
    constructor({
      orderId,
      paymentStatus,
      timestamp
    }: {
      orderId?: number;
      paymentStatus?: string;
      timestamp?: Date;
    }) {
      this.orderId = orderId;
      this.paymentStatus = paymentStatus;
      this.timestamp = timestamp;
    }
  }
  