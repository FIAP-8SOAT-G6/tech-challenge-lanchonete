const ItemDTO = require("../../core/orders/dto/ItemDTO");
const OrderDTO = require("../../core/orders/dto/OrderDTO");

class FakeOrderRepository {
  #orders = [];
  #items = [];

  async create(orderDTO) {
    const { status, code } = orderDTO;
    const order = {
      id: this.#orders.length + 1,
      status,
      code,
      items: []
    };
    this.#orders.push(order);
    return this.#createOrderDTO(order);
  }

  async findById(id) {
    const order = this.#orders.find((order) => order.id === id);
    if (!order) return undefined;
    order.items = this.#items.filter((item) => item.OrderId === order.id);
    return this.#createOrderDTO(order);
  }

  async findAll() {
    const orders = this.#orders.map((order) => ({
      ...order,
      items: this.#items.filter((item) => item.OrderId === order.id)
    }));
    return orders?.length === 0 ? undefined : orders.map(this.#createOrderDTO);
  }

  async createItem(orderDTO, itemDTO) {
    const { id: OrderId } = orderDTO;
    const { productId: ProductId, quantity, unitPrice, totalPrice } = itemDTO;

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
    const itemIndex = this.#items.findIndex(
      (item) => item.OrderId === orderId && item.id === itemId
    );
    this.#items.splice(itemIndex, 1);
  }

  async updateItem(itemId, updatedItemDTO) {
    const itemIndex = this.#items.findIndex((item) => item.id === itemId);
    this.#items[itemIndex] = {
      ...this.#items[itemIndex],
      ...updatedItemDTO
    };
  }

  #createOrderDTO(databaseOrder) {
    return new OrderDTO({
      id: databaseOrder.id,
      code: databaseOrder.code,
      status: databaseOrder.status,
      totalPrice: databaseOrder.totalPrice,
      items: databaseOrder.items.map(
        (databaseItem) =>
          new ItemDTO({
            id: databaseItem.id,
            orderId: databaseItem.OrderId,
            productId: databaseItem.ProductId,
            productName: databaseItem.productName,
            productDescription: databaseItem.productDescription,
            quantity: databaseItem.quantity,
            unitPrice: databaseItem.unitPrice,
            totalPrice: databaseItem.totalPrice
          })
      )
    });
  }
}

module.exports = FakeOrderRepository;
