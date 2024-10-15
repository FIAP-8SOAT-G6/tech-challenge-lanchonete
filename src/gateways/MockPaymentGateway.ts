import PaymentGateway from "../core/interfaces/PaymentGateway";

export default class MockPaymentGateway implements PaymentGateway {
  public async performPayment(orderId: number): Promise<void> {
    console.log(`Payment with orderId: ${orderId} has been successfully processed`);
  }
}
