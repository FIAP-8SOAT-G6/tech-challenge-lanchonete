const ItemDTO = require("../../core/orders/dto/ItemDTO");
const OrderDTO = require("../../core/orders/dto/OrderDTO");
const { sequelize } = require("../../infrastructure/database/models");
const order = require("../../infrastructure/database/models/order");

const {
  Order: SequelizeOrder,
  Item: SequelizeItem,
  Product: SequelizeProduct
} = sequelize.models;

class SequelizeOrderRepository {
  async create(orderAttributes) {
    const { status, code } = orderAttributes;
    const createdOrder = await SequelizeOrder.create({ status, code });
    return this.#createOrderDTO(createdOrder);
  }

  async findById(id) {
    const order = await SequelizeOrder.findByPk(id, {
      include: [
        {
          model: SequelizeItem,
          include: [SequelizeProduct]
        }
      ]
    });
    return order ? this.#createOrderDTO(order) : undefined;
  }

  async findAll() {
    const orders = await SequelizeOrder.findAll({
      include: [
        {
          model: SequelizeItem,
          include: [SequelizeProduct]
        }
      ]
    });
    return orders?.length === 0 ? undefined : orders.map(this.#createOrderDTO);
  }

  async createItem(order, itemDTO) {
    const orderModel = await SequelizeOrder.findByPk(order.id);
    const {
      id,
      orderId: OrderId,
      productId: ProductId,
      quantity,
      unitPrice,
      totalPrice
    } = itemDTO;
    await orderModel.createItem({
      id,
      OrderId,
      ProductId,
      quantity,
      unitPrice,
      totalPrice
    });
  }

  async removeItem(orderId, itemId) {
    const order = await SequelizeOrder.findByPk(orderId);
    await order.removeItem(itemId);
  }

  async updateItem(itemId, itemDTO) {
    const item = await SequelizeItem.findByPk(itemId);
    await item.update(itemDTO);
  }

  async update(orderDTO) {
    const { code, status, customer } = order;
    const createdOrder = await SequelizeOrder.create({
      code,
      status
    });
    return this.#createOrderDTO(createdOrder);
  }

  #createOrderDTO(databaseOrder) {
    return new OrderDTO({
      id: databaseOrder.id,
      code: databaseOrder.code,
      status: databaseOrder.status,
      totalPrice: databaseOrder.totalPrice,
      items: databaseOrder.Items?.map(
        (databaseItem) =>
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

module.exports = SequelizeOrderRepository;
