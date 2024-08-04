const Order = require("../../core/products/entities/Product");
const { sequelize } = require("../../infrastructure/database/models");

const { Order: SequelizeOrder } = sequelize.models;

class SequelizeOrderRepository {
  async create(order) {
    const { code, status, customer } = order;
    const createdOrder = await SequelizeOrder.create({
      code,
      status
    });
    return this.#instantiateOrder(createdOrder);
  }

  #instantiateOrder(orderAttributes) {
    return new Order(
      orderAttributes.id,
      orderAttributes.code
    );
  }
}

module.exports = SequelizeOrderRepository;
