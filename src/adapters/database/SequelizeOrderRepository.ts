import ItemDTO from "../../core/orders/dto/ItemDTO";
import OrderDTO from "../../core/orders/dto/OrderDTO";
import OrderRepository from "../../core/ports/OrderRepository";

import SequelizeOrder from "../../infrastructure/database/models/order";
import SequelizeItem from "../../infrastructure/database/models/item";
import SequelizeProduct from "../../infrastructure/database/models/product";
import SequelizeCustomer from "../../infrastructure/database/models/customer";

export default class SequelizeOrderRepository implements OrderRepository {
  async create(orderDTO: OrderDTO): Promise<OrderDTO> {
    const { status, code, customerId, paymentStatus } = orderDTO as Required<OrderDTO>;
    const createdOrder = await SequelizeOrder.create({
      status,
      code,
      CustomerId: customerId,
      paymentStatus
    });

    return this.#createOrderDTO(createdOrder);
  }

  async findById(id: number): Promise<OrderDTO | undefined> {
    const order = await SequelizeOrder.findByPk(id, {
      include: [
        {
          model: SequelizeItem,
          include: [SequelizeProduct]
        },
        {
          model: SequelizeCustomer
        }
      ]
    });
    return order ? this.#createOrderDTO(order) : undefined;
  }

  async findAll(): Promise<OrderDTO[] | undefined> {
    const orders = await SequelizeOrder.findAll({
      include: [
        {
          model: SequelizeItem,
          include: [SequelizeProduct]
        },
        {
          model: SequelizeCustomer
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    return orders?.length === 0 ? undefined : orders.map(this.#createOrderDTO);
  }

  async findOrdersByStatusAndSortByAscDate(status: string): Promise<OrderDTO[] | []> {
    const orders = await SequelizeOrder.findAll({
      include: [
        {
          model: SequelizeItem,
          include: [SequelizeProduct]
        },
        {
          model: SequelizeCustomer
        }
      ],
      where: { status },
      order: [["createdAt", "ASC"]]
    });

    return orders?.length === 0 ? [] : orders.map(this.#createOrderDTO);
  }

  async createItem(order: OrderDTO, itemDTO: ItemDTO) {
    const orderModel = await SequelizeOrder.findByPk(order.id);
    const { id, orderId: OrderId, productId: ProductId, quantity, unitPrice, totalPrice } = itemDTO;
    await orderModel!.createItem({
      ProductId,
      quantity: quantity!,
      unitPrice: unitPrice!,
      totalPrice: totalPrice!
    });
  }

  async removeItem(orderId: number, itemId: number) {
    const order = await SequelizeOrder.findByPk(orderId);
    if (order) await order.removeItem(itemId);
  }

  async updateItem(itemId: number, itemDTO: ItemDTO) {
    const item = await SequelizeItem.findByPk(itemId)!;
    if (item) await item.update(itemDTO);
  }

  async updateOrder(orderDTO: OrderDTO): Promise<OrderDTO | undefined> {
    const { id, code, status } = orderDTO;
    const order = await SequelizeOrder.findByPk(id)!;
    if (order) {
      const updatedOrder = order.update({ code, status });
      return this.#createOrderDTO(updatedOrder);
    }
  }

  #createOrderDTO(databaseOrder: any) {
    return new OrderDTO({
      id: databaseOrder.id,
      createdAt: databaseOrder.createdAt,
      code: databaseOrder.code,
      status: databaseOrder.status,
      totalPrice: databaseOrder.totalPrice,
      customerId: databaseOrder.CustomerId,
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
