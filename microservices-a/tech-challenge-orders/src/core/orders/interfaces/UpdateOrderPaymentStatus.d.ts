import PaymentDTO from "../dto/PaymentDTO";

export default interface UpdateOrderPaymentStatus {
  updateOrderPaymentStatus(paymentDTO: PaymentDTO): Promise<OrderDTO>;
}
