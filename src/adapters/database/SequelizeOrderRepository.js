const Order = require("../../core/orders/entities/Order");
const { sequelize } = require("../../infrastructure/database/models");
const order = require("../../infrastructure/database/models/order");

const {
  Order: SequelizeOrder,
  Item: SequelizeItem,
  Product: SequelizeProduct,
} = sequelize.models;

class SequelizeOrderRepository {
  async create(orderAttributes) {
    const { status, code } = orderAttributes;
    const createdOrder = await SequelizeOrder.create({ status, code });
    return this.#instantiateOrder(createdOrder);
  }

  async findById(id) {
    const order = await SequelizeOrder.findByPk(id, {
      include: [
        {
          model: SequelizeItem,
          include: [SequelizeProduct],
        },
      ],
    });
    return order ? this.#instantiateOrder(order) : undefined;
  }

  async findAll() {
    const orders = await SequelizeOrder.findAll({
      include: [
        {
          model: SequelizeItem,
          include: [SequelizeProduct],
        },
      ],
    });
    return orders?.length === 0
      ? undefined
      : orders.map(this.#instantiateOrder).sort((a, b) => a.createdAt - b.createdAt);
  }

  async createItem(order, item) {
    const orderModel = await SequelizeOrder.findByPk(order.id);
    const {
      id,
      orderId: OrderId,
      productId: ProductId,
      quantity,
      unitPrice,
      totalPrice,
    } = item.getAttributes();
    await orderModel.createItem({
      id,
      OrderId,
      ProductId,
      quantity,
      unitPrice,
      totalPrice,
    });
  }

  async removeItem(orderId, itemId) {
    const order = await SequelizeOrder.findByPk(orderId);
    await order.removeItem(itemId);
  }

  async updateItem(itemId, updatedItem) {
    const itemAttributes = updatedItem.getAttributes();
    const item = await SequelizeItem.findByPk(itemId);
    await item.update(itemAttributes);
  }

  async update(order) {
    const { code, status, customer } = order;
    const createdOrder = await SequelizeOrder.create({
      code,
      status,
    });
    return this.#instantiateOrder(createdOrder);
  }

  #instantiateOrder(orderAttributes) {
    const order = new Order({
      id: orderAttributes.id,
      status: orderAttributes.status,
      code: orderAttributes.code,
      totalPrice: orderAttributes.totalPrice,
      createdAt: orderAttributes.createdAt
    });
    orderAttributes.Items?.forEach((item) => {
      const {
        id,
        OrderId: orderId,
        ProductId: productId,
        quantity,
        unitPrice,
      } = item;
      order.addItem({
        id,
        orderId,
        productId,
        quantity,
        unitPrice,
        productName: item.Product?.name,
        productDescription: item.Product?.description,
      });
    });

    // TODO: Add to a decorator + test (wait for DTO disussion)
    const minutes = Math.floor(order.getElapsedTime() / 60000);
    let response = 0

    if (minutes < 60) {
      response = `${minutes} minute${minutes === 1 ? '' : 's'}`;
    } else {
      const hours = Math.floor(minutes / 60);
      response = `${hours} hour${hours === 1 ? '' : 's'}`;
    }

    order["elapsedTime"] = response;

    return order;
  }
}

module.exports = SequelizeOrderRepository;
