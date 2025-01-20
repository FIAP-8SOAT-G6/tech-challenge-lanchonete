import { OrderDataSource } from "../interfaces/DataSources";

import ItemDTO from "../core/orders/dto/ItemDTO";
import OrderDTO from "../core/orders/dto/OrderDTO";
import OrderModel from "../infrastructure/database/models/order";
import ItemModel from "../infrastructure/database/models/item";
import ProductModel from "../infrastructure/database/models/product";
import CustomerModel from "../infrastructure/database/models/customer";

export default class OrderModelDataSource implements OrderDataSource {
  async create(orderDTO: OrderDTO): Promise<OrderDTO> {
    const { status, code, customerId, paymentStatus } = orderDTO as Required<OrderDTO>;
    const createdOrder = await OrderModel.create({
      status,
      code,
      CustomerId: customerId,
      paymentStatus
    });

    return this.createOrderDTO(createdOrder);
  }

  async findById(id: number): Promise<OrderDTO | undefined> {
    const order = await OrderModel.findByPk(id, {
      include: [
        {
          model: ItemModel,
          include: [ProductModel]
        },
        {
          model: CustomerModel
        }
      ]
    });
    return order ? this.createOrderDTO(order) : undefined;
  }

  async findAll(): Promise<OrderDTO[] | []> {
    const orders = await OrderModel.findAll({
      include: [
        {
          model: ItemModel,
          include: [ProductModel]
        },
        {
          model: CustomerModel
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    return orders?.length === 0 ? [] : orders.map(this.createOrderDTO);
  }

  async findOrdersByStatusAndSortByAscDate(status: string): Promise<OrderDTO[] | []> {
    const orders = await OrderModel.findAll({
      include: [
        {
          model: ItemModel,
          include: [ProductModel]
        },
        {
          model: CustomerModel
        }
      ],
      where: { status },
      order: [["createdAt", "ASC"]]
    });

    return orders?.length === 0 ? [] : orders.map(this.createOrderDTO);
  }

  async updateOrder(orderDTO: OrderDTO): Promise<OrderDTO | undefined> {
    const { id, code, status, paymentStatus } = orderDTO;

    const order = await OrderModel.findByPk(id)!;
    if (order) {
      const updatedOrder = await order.update({ code, status, paymentStatus });
      return this.findById(updatedOrder.id);
    }
  }

  async createItem(orderDTO: OrderDTO, itemDTO: ItemDTO) {
    const order = await OrderModel.findByPk(orderDTO.id);
    const { productId: ProductId, quantity, unitPrice, totalPrice } = itemDTO;
    await order!.createItem({
      ProductId,
      quantity: quantity!,
      unitPrice: unitPrice!,
      totalPrice: totalPrice!
    });
    return order;
  }

  async updateItem(itemId: number, itemDTO: ItemDTO) {
    const item = await ItemModel.findByPk(itemId)!;
    if (item) await item.update(itemDTO);
  }

  async removeItem(orderId: number, itemId: number) {
    const order = await OrderModel.findByPk(orderId);
    if (order) await order.removeItem(itemId);
  }

  private createOrderDTO(databaseOrder: any) {
    return new OrderDTO({
      id: databaseOrder.id,
      createdAt: databaseOrder.createdAt,
      code: databaseOrder.code,
      status: databaseOrder.status,
      totalPrice: databaseOrder.totalPrice,
      customerId: databaseOrder.CustomerId,
      paymentStatus: databaseOrder.paymentStatus,
      customerName: databaseOrder.Customer?.name,
      items: databaseOrder.Items?.map(
        (databaseItem: any) =>
          new ItemDTO({
            id: databaseItem.id,
            orderId: databaseItem.OrderId,
            productId: databaseItem.ProductId,
            quantity: databaseItem.quantity,
            unitPrice: databaseItem.unitPrice,
            totalPrice: databaseItem.totalPrice,
            productName: databaseItem.Product?.name,
            productDescription: databaseItem.Product?.description
          })
      )
    });
  }
}
