import OrderGatewayInterface from "../core/interfaces/OrderGateway";
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

  async getOrdersByStatusAndSortByAscDate(status: string): Promise<OrderDTO[]> {
    return await this.dataSource.findOrdersByStatusAndSortByAscDate(status);
  }

  async getOrdersAll(): Promise<OrderDTO[]> {
    return await this.dataSource.findAll();
  }

  async updateOrder(orderDTO: OrderDTO): Promise<OrderDTO> {
    const updatedOrder = await this.dataSource.updateOrder(orderDTO);
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
