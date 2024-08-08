const Order = require("../../core/orders/entities/Order");
const { sequelize } = require("../../infrastructure/database/models");

const {
  Order: SequelizeOrder,
  Item: SequelizeItem,
  Product: SequelizeProduct,
} = sequelize.models;

class SequelizeOrderRepository {
  async create(orderAttributes) {
    const { status } = orderAttributes;
    const createdOrder = await SequelizeOrder.create({
      status,
    });
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
    const orderWithItems = await orderModel.createItem({
      id,
      OrderId,
      ProductId,
      quantity,
      unitPrice,
      totalPrice,
    });
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
    });
    orderAttributes.Items?.forEach((item) => {
      const {
        id,
        OrderId: orderId,
        ProductId: productId,
        quantity,
        unitPrice,
      } = item
      console.log(item)
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
    return order;
  }
}

module.exports = SequelizeOrderRepository;
