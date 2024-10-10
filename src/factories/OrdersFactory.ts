import CreateOrder from "../core/orders/interfaces/CreateOrder";
import CreateOrderUseCase from "../core/orders/use-cases/CreateOrderUseCase";
import CustomerGateway from "../gateways/CustomerGateway";
import OrderGateway from "../gateways/OrderGateway";
import { CustomerDataSource, OrderDataSource } from "../interfaces/DataSources";

export class OrdersFactory {
  public static makeCreateOrder(orderDataSource: OrderDataSource, customerDataSource: CustomerDataSource): CreateOrder {
    return new CreateOrderUseCase(new OrderGateway(orderDataSource), new CustomerGateway(customerDataSource));
  }
}
