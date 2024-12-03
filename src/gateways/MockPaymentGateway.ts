import PaymentGateway from "../core/interfaces/PaymentGateway";
import PaymentDTO from "../core/orders/dto/PaymentDTO";

export default class MockPaymentGateway implements PaymentGateway {
  public async performPayment(orderId: number): Promise<string> {
    console.log(`Payment with orderId: ${orderId} has been successfully processed`);
    return "";
  }

  public async getPaymentDetails(paymentId: number): Promise<PaymentDTO> {
    return new PaymentDTO({});
  }
}
