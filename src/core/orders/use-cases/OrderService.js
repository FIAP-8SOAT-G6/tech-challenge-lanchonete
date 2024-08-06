const Product = require("../../products/entities/Product");

class OrderService {
  constructor(orderRepository, itemRepository) {
    this.orderRepository = orderRepository;
    this.itemRepository = itemRepository;
  }

  async create(orderAttributes) {
    const { status } = orderAttributes;
    const order = new Order(status);    
    const createdOrder = await this.orderRepository.create(order);

    const items = orderAttributes.items.map(item => 
      new Item({
        orderId: createdOrder.id,
        productId: item.productId,
        quantity: item.quantity, 
        unitPrice: item.unitPrice,
        totalPrice: (item.quantity * item.unitPrice)
      })
    );
    // TODO checar como fazer
    const createdItems = await this.itemRepository.bulkCreate(items)

    return this.buildOrder(createdOrder, createdItems)
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
