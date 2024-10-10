import OrderGatewayInterface from "../core/gateways/OrderGateways";
import OrderDTO from "../core/orders/dto/OrderDTO";
import { OrderDataSource } from "../interfaces/DataSources";

export default class OrderGateway implements OrderGatewayInterface {
  constructor(private dataSource: OrderDataSource) {}

  async createOrder(orderDTO: OrderDTO): Promise<OrderDTO> {
    const createdOrder = await this.dataSource.create(orderDTO);
    return createdOrder;
  }

  async getOrder(orderId: number): Promise<OrderDTO | undefined> {
    const order = await this.dataSource.findById(orderId);
    if (!order) return undefined;
    return order;
  }

  // async getOrder(orderId: number): Promise<OrderDTO | undefined> {
  //   const order = await this.dataSource.findById(orderId);
  //   if (!order) return undefined;
  //   return order;
  // }

  // async getOrdersByPriority(status: string): Promise<OrderDTO[] | []> {
  //   const orders = await this.dataSource.findOrdersByStatusAndSortByAscDate(status);
  //   if (!orders) return [];

  //   return orders;
  // }

  // async getOrdersAll(): Promise<OrderDTO[] | undefined> {
  //   const orders = await this.dataSource.findAll();
  //   if (!orders) return undefined;

  //   return orders;
  // }

  // async getPaymentStatus(orderId: number): Promise<string> {
  //   const order = await this.dataSource.findById(orderId);
  //   return order.paymentStatus;
  // }

  // async updateOrderStatus(orderId: number, status: string): Promise<OrderDTO> {
  //   const order = await this.dataSource.findById(orderId);
  //   order.status = status;
  //   const updatedOrder = await this.dataSource.updateOrder(order);
  //   return updatedOrder;
  // }

  // checkout(orderId: number): Promise<any>;

  // addItem(orderId: number, ItemDTO: ItemDTO): Promise<OrderDTO>;
  // updateItem(orderId: number, itemId: number, updateItemDTO: ItemDTO): Promise<OrderDTO>;
  // deleteItem(orderId: number, itemId: number): Promise<undefined>;
}
