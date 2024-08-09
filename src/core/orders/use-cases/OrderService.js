const Product = require("../../products/entities/Product");
const Order = require("../entities/Order");
const OrderStatus = require("../entities/OrderStatus");

class OrderService {
  constructor(orderRepository, productRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
  }

  async create() {
    const order = new Order({ status: OrderStatus.CREATED });
    const createdOrder = await this.orderRepository.create(order);
    console.log(createdOrder);
    return createdOrder;
  }

  async getOrders() {
    const orders = await this.orderRepository.findAll();
    return orders;
  }

  async getOrder(orderId) {
    const order = await this.orderRepository.findById(orderId);
    return order;
  }

  async addItem(orderId, itemAttributes) {
    const { productId, quantity } = itemAttributes;
    const [product, order] = await Promise.all([
      this.productRepository.findById(productId),
      this.orderRepository.findById(orderId),
    ]);

    const item = order.addItem({
      productId: product.id,
      quantity,
      unitPrice: product.price,
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
}

module.exports = OrderService;
