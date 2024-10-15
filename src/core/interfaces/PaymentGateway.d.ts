import ProductDTO from "../products/dto/ProductDTO";

export default interface PaymentGateway {
  performPayment(orderId: number): Promise<void>;
}
