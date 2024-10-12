import OrderGatewayInterface from "../core/gateways/OrderGateway";
import ItemDTO from "../core/orders/dto/ItemDTO";
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

  async getOrdersByStatusAndSortByAscDate(status: string): Promise<OrderDTO[] | []> {
    const orders = await this.dataSource.findOrdersByStatusAndSortByAscDate(status);
    if (!orders) return [];

    return orders;
  }

  async getOrdersAll(): Promise<OrderDTO[] | undefined> {
    const orders = await this.dataSource.findAll();
    if (!orders) return undefined;

    return orders;
  }

  async getPaymentStatus(orderId: number): Promise<string> {
    const order = await this.dataSource.findById(orderId);
    return order.paymentStatus;
  }

  async updateOrder(orderDTO: OrderDTO): Promise<OrderDTO> {
    const updatedOrder = await this.dataSource.updateOrder(orderDTO);
    return updatedOrder;
  }

  async updateOrderStatus(orderId: number, status: string): Promise<OrderDTO> {
    const order = await this.dataSource.findById(orderId);
    order.status = status;
    const updatedOrder = await this.dataSource.updateOrder(order);
    return updatedOrder;
  }

  async checkout(orderId: number): Promise<OrderDTO> {
    const order = await this.dataSource.findById(orderId);
    const updatedOrder = await this.dataSource.updateOrder(order);
    return updatedOrder;
  }

  async addItem(orderDTO: OrderDTO, itemDTO: ItemDTO) {
    await this.dataSource.createItem(orderDTO, itemDTO);
  }

  async updateItem(itemId: number, updateItemDTO: ItemDTO) {
    await this.dataSource.updateItem(itemId, updateItemDTO);
  }

  async deleteItem(orderId: number, itemId: number) {
    await this.dataSource.removeItem(orderId, itemId);
    return;
  }
}