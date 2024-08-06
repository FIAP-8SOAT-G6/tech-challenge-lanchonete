const Product = require("../../products/entities/Product");


class OrderService {
  constructor(orderRepository, itemRepository) {
    this.orderRepository = orderRepository;
    this.itemRepository = itemRepository;
  }

  async create(orderAttributes) {
    const { status, items } = orderAttributes;
    // TODO checar como fazer
    const order = new Order();
    
    const createdOrder = await this.orderRepository.create(order);

    const itemAttributes = orderAttributes.items.map(item => ({
      orderId: createdOrder.id,
      productId: item.productId,
      quantity: item.quantity, 
      unitPrice: item.unitPrice,
      totalPrice: (item.quantity * item.unitPrice)
    }));
    // TODO checar como fazer
    await this.itemRepository.bulkCreate(itemAttributes)
  }
}

module.exports = OrderService;
