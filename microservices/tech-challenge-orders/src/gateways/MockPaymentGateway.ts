import PaymentGateway from "../core/interfaces/PaymentGateway";
import PaymentDTO from "../core/orders/dto/PaymentDTO";

export default class MockPaymentGateway implements PaymentGateway {
  private mockedPaymentDetails?: PaymentDTO;

  public async performPayment(orderId: number): Promise<string> {
    console.log(`Payment with orderId: ${orderId} has been successfully processed`);
    return "";
  }

  public async getPaymentDetails(paymentId: number): Promise<PaymentDTO> {
    return Promise.resolve(this.mockedPaymentDetails!);
  }

  public createPaymentDetails(paymentDTO: PaymentDTO) {
    this.mockedPaymentDetails = paymentDTO;
  }
}
