import PaymentDTO from "../../webhooks/dto/PaymentDTO";

export default interface UpdateOrderPaymentStatus {
  updateOrderPaymentStatus(paymentDTO: PaymentDTO): Promise<OrderDTO>;
}
