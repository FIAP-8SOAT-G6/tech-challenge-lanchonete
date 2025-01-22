import ItemDTO from "../core/orders/dto/ItemDTO";
import OrderDTO from "../core/orders/dto/OrderDTO";
import { OrdersFactory } from "../factories/OrdersFactory";
import { CustomerDataSource, OrderDataSource, ProductDataSource } from "../interfaces/DataSources";
import { PaymentSystem } from "../interfaces/PaymentSystem";
import OrderPresenter, { OrderResponse, QRCodeResponse } from "../presenters/OrderPresenters";

export default class OrderController {
  public static async createOrder(
    orderDataSource: OrderDataSource,
    customerDataSource: CustomerDataSource,
    orderDTO: OrderDTO
  ): Promise<OrderResponse> {
    const useCase = OrdersFactory.makeCreateOrder(orderDataSource, customerDataSource);
    const createdOrder = await useCase.createOrder(orderDTO);
    return OrderPresenter.adaptOrderData(createdOrder);
  }

  public static async getOrder(orderDataSource: OrderDataSource, orderId: number): Promise<OrderResponse> {
    const useCase = OrdersFactory.makeGetOrder(orderDataSource);
    const order = await useCase.getOrder(orderId);
    return OrderPresenter.adaptOrderData(order);
  }

  public static async getOrders(orderDataSource: OrderDataSource): Promise<OrderResponse[]> {
    const useCase = OrdersFactory.makeGetOrders(orderDataSource);
    const orders = await useCase.getOrders();
    return OrderPresenter.adaptOrdersData(orders);
  }

  public static async getOrdersAll(orderDataSource: OrderDataSource): Promise<OrderResponse[]> {
    const useCase = OrdersFactory.makeGetOrdersAll(orderDataSource);
    const ordersAll = await useCase.getOrdersAll();
    return OrderPresenter.adaptOrdersData(ordersAll);
  }

  public static async getPaymentStatus(orderDataSource: OrderDataSource, orderId: number): Promise<string> {
    const useCase = OrdersFactory.makeGetPaymentStatus(orderDataSource);
    const paymentStatus = await useCase.getPaymentStatus(orderId);
    return paymentStatus;
  }

  public static async checkout(orderDataSource: OrderDataSource, paymentSystem: PaymentSystem, orderId: number): Promise<QRCodeResponse> {
    const useCase = OrdersFactory.makeCheckout(orderDataSource, paymentSystem);
    const orderPaymentQRCode = await useCase.checkout(orderId);
    return OrderPresenter.adaptOrderCheckoutData(orderPaymentQRCode);
  }

  public static async updateOrderStatus(orderDataSource: OrderDataSource, orderId: number, status: string): Promise<OrderResponse> {
    const useCase = OrdersFactory.makeUpdateOrderStatus(orderDataSource);
    const order = await useCase.updateOrderStatus(orderId, status);
    return OrderPresenter.adaptOrderData(order);
  }

  public static async addItem(
    orderDataSource: OrderDataSource,
    productDataSource: ProductDataSource,
    orderId: number,
    addItemDTO: ItemDTO
  ): Promise<OrderResponse> {
    const useCase = OrdersFactory.makeAddItem(orderDataSource, productDataSource);
    const order = await useCase.addItem(orderId, addItemDTO);
    return OrderPresenter.adaptOrderData(order);
  }

  public static async updateItem(orderDataSource: OrderDataSource, orderId: number, itemId: number, updateItemDTO: ItemDTO): Promise<OrderResponse> {
    const useCase = OrdersFactory.makeUpdateItem(orderDataSource);
    const order = await useCase.updateItem(orderId, itemId, updateItemDTO);
    return OrderPresenter.adaptOrderData(order);
  }

  public static async deleteItem(orderDataSource: OrderDataSource, orderId: number, itemId: number): Promise<any> {
    const useCase = OrdersFactory.makeDeleteItem(orderDataSource);
    await useCase.deleteItem(orderId, itemId);
    return;
  }
}
