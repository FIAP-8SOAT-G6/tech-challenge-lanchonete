import UpdateOrderPaymentStatus from "../core/orders/interfaces/UpdateOrderPaymentStatus";
import ProcessOrderPaymentUseCase from "../core/orders/use-cases/ProcessOrderPaymentUseCase";
import OrderGateway from "../gateways/OrderGateway";
import { PaymentGateway } from "../gateways/PaymentGateway";
import { OrderDataSource } from "../interfaces/DataSources";
import { PaymentSystem } from "../interfaces/PaymentSystem";

export class WebhooksFactory {
  public static processPayment(orderDataSource: OrderDataSource, paymentSystem: PaymentSystem): UpdateOrderPaymentStatus {
    return new ProcessOrderPaymentUseCase(new OrderGateway(orderDataSource), new PaymentGateway(new OrderGateway(orderDataSource), paymentSystem));
  }
}
