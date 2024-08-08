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

  async addItem(orderId, itemAttributes) {
    const { productId, quantity } = itemAttributes;
    const product = await this.productRepository.findById(productId);
    const order = await this.orderRepository.findById(orderId);

    const item = order.addItem({
      productId: product.id,
      quantity,
      unitPrice: product.price,
    });
    console.log(item);
    await this.orderRepository.createItem(order, item);

    const orderWithItems = await this.orderRepository.findById(orderId);
    console.log(orderWithItems);

    return orderWithItems;
  }

  #buildOrder(orderModel, itemsModel) {
    return new Order(
      orderModel.id,
      orderModel.code,
      orderModel.status,
      orderModel.totalPrice,
      null, // customer
      items
    );
  }
}

module.exports = OrderService;
