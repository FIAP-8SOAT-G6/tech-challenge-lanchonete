const Order = require("../../orders/entities/Order");

class OrderManagement {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async create(orderData) {
    try {
      const { code, status, productId } = orderData;
      // TODO: calcular total na order
      const order = new Order(null, code, status, productId);

      return await this.orderRepository.create(order);
    } catch (error) {
      //TODO: raise invalid order data
      throw new Error(error.message);
    }
  }
}

module.exports = OrderManagement;
