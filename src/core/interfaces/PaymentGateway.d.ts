import ProductDTO from "../products/dto/ProductDTO";

export default interface PaymentGateway {
  performPayment(orderId: number): Promise<string>;
  getPaymentDetails(paymentId: number): Promise<PaymentDTO>;
  createPaymentDetails(paymentDTO: PaymentDTO);
}
