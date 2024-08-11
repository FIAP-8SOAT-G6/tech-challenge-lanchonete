const Order = require("../../core/orders/entities/Order");

class FakeOrderRepository {
  #orders = [];
  #items = [];

  async create(orderAttributes) {
    const { status, code } = orderAttributes;
    const order = {
      id: this.#orders.length + 1,
      status,
      code,
      items: []
    };
    this.#orders.push(order);
    return this.#instantiateOrder(order);
  }

  async findById(id) {
    const order = this.#orders.find((order) => order.id === id);
    if (!order) return undefined;
    order.items = this.#items.filter((item) => item.OrderId === order.id);
    return this.#instantiateOrder(order);
  }

  async findAll() {
    const orders = this.#orders.map((order) => ({
      ...order,
      items: this.#items.filter((item) => item.OrderId === order.id)
    }));
    return orders?.length === 0
      ? undefined
      : orders.map(this.#instantiateOrder);
  }

  async createItem(order, item) {
    const {
      orderId: OrderId,
      productId: ProductId,
      quantity,
      unitPrice,
      totalPrice
    } = item.getAttributes();

    this.#items.push({
      id: this.#items.length + 1,
      OrderId,
      ProductId,
      quantity,
      unitPrice,
      totalPrice
    });
  }

  async removeItem(orderId, itemId) {
    const itemIndex = this.#items.findIndex((item) => item.id === itemId);
    this.#items.splice(itemIndex, 1);
  }

  async updateItem(itemId, updatedItem) {
    const itemIndex = this.#items.findIndex((item) => item.id === itemId);
    this.#items[itemIndex] = {
      ...this.#items[itemIndex],
      ...updatedItem
    };
  }

  #createOrderDTO(orderAttributes) {
    const orderDTO = {
      id: orderAttributes.id,
      status: orderAttributes.status,
      code: orderAttributes.code,
      totalPrice: orderAttributes.totalPrice,
      items:
        orderAttributes.items?.map((item) => ({
          id,
          orderId: item.OrderId,
          productId: item.ProductId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          productName: item.productName,
          productDescription: item.productDescription
        })) ?? []
    };

    return orderDTO;
  }

  #instantiateOrder(orderAttributes) {
    const order = new Order({
      id: orderAttributes.id,
      status: orderAttributes.status,
      code: orderAttributes.code,
      totalPrice: orderAttributes.totalPrice
    });
    orderAttributes.items?.forEach((item) => {
      const {
        id,
        OrderId: orderId,
        ProductId: productId,
        quantity,
        unitPrice
      } = item;
      order.addItem({
        id,
        orderId,
        productId,
        quantity,
        unitPrice,
        productName: item.productName,
        productDescription: item.productDescription
      });
    });
    return order;
  }
}

module.exports = FakeOrderRepository;
