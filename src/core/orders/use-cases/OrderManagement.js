const Order = require("../entities/Order");
const OrderStatus = require("../entities/OrderStatus");

const UnexistingOrderError = require("../exceptions/UnexistingOrderError");
const UnexistingProductError = require("../../products/exceptions/UnexistingProductError");

const OrderDTO = require("../dto/OrderDTO");
const ItemDTO = require("../dto/ItemDTO");

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
    const orderDTO = this.#toOrderDTO(order);
    const createdOrder = await this.orderRepository.create(orderDTO);

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

  async addItem(orderId, itemDTO) {
    const { productId, quantity } = itemDTO;

    const [productDTO, orderDTO] = await Promise.all([
      this.productRepository.findById(productId),
      this.orderRepository.findById(orderId)
    ]);

    if (!orderDTO) throw new UnexistingOrderError(orderId);
    if (!productDTO) throw new UnexistingProductError(productId);

    const order = this.#toOrderEntity(orderDTO);
    const item = order.addItem({
      productId: productDTO.id,
      quantity,
      unitPrice: productDTO.price
    });

    await this.orderRepository.createItem(
      this.#toOrderDTO(order),
      this.#toItemDTO(item)
    );

    return await this.orderRepository.findById(orderId);
  }

  async removeItem(orderId, itemId) {
    await this.orderRepository.removeItem(orderId, itemId);
  }

  async updateItem(orderId, itemId, itemDTO) {
    const orderDTO = await this.orderRepository.findById(orderId);

    if (!orderDTO) throw new UnexistingOrderError(orderId);
    const order = this.#toOrderEntity(orderDTO);

    const updatedItem = order.updateItem(itemId, itemDTO);
    await this.orderRepository.updateItem(itemId, this.#toItemDTO(updatedItem));
    return await this.orderRepository.findById(orderId);
  }

  #generateCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  #toOrderEntity(orderDTO) {
    return new Order({
      id: orderDTO.id,
      code: orderDTO.code,
      // customer: orderDTO.customer,
      status: orderDTO.status,
      totalPrice: orderDTO.status,
      items: orderDTO.items
    });
  }

  #toOrderDTO(orderEntity) {
    return new OrderDTO({
      id: orderEntity.getId(),
      code: orderEntity.getCode(),
      status: orderEntity.getStatus(),
      totalPrice: orderEntity.getTotalPrice(),
      items: orderEntity.getItems().map(this.#toItemDTO)
    });
  }

  #toItemDTO(itemEntity) {
    return new ItemDTO({
      id: itemEntity.getId(),
      orderId: itemEntity.getOrderId(),
      productId: itemEntity.getProductId(),
      productName: itemEntity.getProductName(),
      productDescription: itemEntity.getProductDescription(),
      quantity: itemEntity.getQuantity(),
      unitPrice: itemEntity.getUnitPrice(),
      totalPrice: itemEntity.getTotalPrice()
    });
  }
}

module.exports = OrderManagement;
