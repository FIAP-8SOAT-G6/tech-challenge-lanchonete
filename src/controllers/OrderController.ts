import OrderDTO from "../core/orders/dto/OrderDTO";
import { OrdersFactory } from "../factories/OrdersFactory";
import { CustomerDataSource, OrderDataSource } from "../interfaces/DataSources";
import OrderPresenter from "../presenters/OrderPresenters";

export default class OrderController {
  public static async createOrder(orderDataSource: OrderDataSource, customerDataSource: CustomerDataSource, order: OrderDTO): Promise<string> {
    const useCase = OrdersFactory.makeCreateOrder(orderDataSource, customerDataSource);
    const createdOrder = await useCase.createOrder(order);
    return OrderPresenter.adaptOrderData(createdOrder);
  }
}
