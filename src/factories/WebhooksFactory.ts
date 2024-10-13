import UpdateOrderPaymentStatus from "../core/orders/interfaces/UpdateOrderPaymentStatus";
import UpdateOrderPaymentStatusUseCase from "../core/orders/use-cases/UpdateOrderPaymentStatusUseCase";
import OrderGateway from "../gateways/OrderGateway";
import { OrderDataSource } from "../interfaces/DataSources";

export class WebhooksFactory {
  public static process(orderDataSource: OrderDataSource): UpdateOrderPaymentStatus {
    return new UpdateOrderPaymentStatusUseCase(new OrderGateway(orderDataSource));
  }
}
