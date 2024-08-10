const Product = require("../../products/entities/Product");
const Order = require("../entities/Order");
const OrderStatus = require("../entities/OrderStatus");
const UnexistingOrderError = require("../exceptions/UnexistingOrderError");
const UnexistingProductError = require("../../products/exceptions/UnexistingProductError");

class OrderManagement {
  constructor(orderRepository, productRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
  }

  async create() {
    const order = new Order({
      status: OrderStatus.CREATED,
      code: this.#generateCode()
    });
    const createdOrder = await this.orderRepository.create(order);

    return createdOrder;
  }

  async getOrders() {
    const orders = await this.orderRepository.findAll();
    return orders;
  }

  async getOrder(orderId) {
    const order = await this.orderRepository.findById(orderId);

    if (!order) throw new UnexistingOrderError(orderId);

    return order;
  }

  async addItem(orderId, itemAttributes) {
    const { productId, quantity } = itemAttributes;
    const [product, order] = await Promise.all([
      this.productRepository.findById(productId),
      this.orderRepository.findById(orderId)
    ]);

    if (!order) throw new UnexistingOrderError(orderId);
    if (!product) throw new UnexistingProductError(productId);

    const item = order.addItem({
      productId: product.id,
      quantity,
      unitPrice: product.price
    });

    await this.orderRepository.createItem(order, item);

    return await this.orderRepository.findById(orderId);
  }

  async removeItem(orderId, itemId) {
    await this.orderRepository.removeItem(orderId, itemId);
  }

  async updateItem(orderId, itemId, updatedItemValues) {
    const order = await this.orderRepository.findById(orderId);
    const updatedItem = order.updateItem(itemId, updatedItemValues);
    await this.orderRepository.updateItem(itemId, updatedItem);
    return await this.orderRepository.findById(orderId);
  }

  #generateCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}

module.exports = OrderManagement;
