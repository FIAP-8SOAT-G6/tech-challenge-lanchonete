const Order = require("../entities/Order");
const OrderStatus = require("../entities/OrderStatus");

const ResourceNotFoundError = require("../../common/exceptions/ResourceNotFoundError");

const OrderDTO = require("../dto/OrderDTO");
const ItemDTO = require("../dto/ItemDTO");

class OrderManagement {
  constructor(orderRepository, productRepository, customerRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.customerRepository = customerRepository;
  }

  async create(orderDTO) {
    const customerDTO = await this.customerRepository.findById(
      orderDTO.customerId
    );
    if (!customerDTO)
      throw new ResourceNotFoundError(
        ResourceNotFoundError.Resources.Customer,
        "id",
        orderDTO.customerId
      );

    const order = new Order({
      status: OrderStatus.CREATED,
      code: this.#generateCode(),
      customerId: customerDTO.id
    });
    const createdOrderDTO = await this.orderRepository.create(
      this.#toOrderDTO(order)
    );
    const completeOrderDTO = await this.orderRepository.findById(
      createdOrderDTO.id
    );
    const completeOrder = this.#toOrderEntity(completeOrderDTO);

    return this.#toOrderDTO(completeOrder);
  }

  async getOrders() {
    const repositoryOrderDTOs = await this.orderRepository.findAll();
    const orders = repositoryOrderDTOs.map(this.#toOrderEntity);
    return orders.map(this.#toOrderDTO.bind(this));
  }

  async getOrder(orderId) {
    const repositoryOrderDTO = await this.orderRepository.findById(orderId);

    if (!repositoryOrderDTO)
      throw new ResourceNotFoundError(
        ResourceNotFoundError.Resources.Order,
        "id",
        orderId
      );
    const order = this.#toOrderEntity(repositoryOrderDTO);

    return this.#toOrderDTO(order);
  }

  async addItem(orderId, itemDTO) {
    const { productId, quantity } = itemDTO;

    const [productDTO, orderDTO] = await Promise.all([
      this.productRepository.findById(productId),
      this.orderRepository.findById(orderId)
    ]);

    if (!orderDTO)
      throw new ResourceNotFoundError(
        ResourceNotFoundError.Resources.Order,
        "id",
        orderId
      );
    if (!productDTO)
      throw new ResourceNotFoundError(
        ResourceNotFoundError.Resources.Product,
        "id",
        productId
      );

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

    const updatedOrderDTO = await this.orderRepository.findById(orderId);
    const updatedOrder = this.#toOrderEntity(updatedOrderDTO);

    return this.#toOrderDTO(updatedOrder);
  }

  async removeItem(orderId, itemId) {
    const orderDTO = await this.orderRepository.findById(orderId);
    const order = this.#toOrderEntity(orderDTO);
    order.removeItem(itemId);
    await this.orderRepository.removeItem(orderId, itemId);
  }

  async updateItem(orderId, itemId, itemDTO) {
    const orderDTO = await this.orderRepository.findById(orderId);

    if (!orderDTO)
      throw new ResourceNotFoundError(
        ResourceNotFoundError.Resources.Order,
        "id",
        orderId
      );
    const order = this.#toOrderEntity(orderDTO);

    const updatedItem = order.updateItem(itemId, itemDTO);
    await this.orderRepository.updateItem(itemId, this.#toItemDTO(updatedItem));

    const updatedOrderDTO = await this.orderRepository.findById(orderId);
    const updatedOrder = this.#toOrderEntity(updatedOrderDTO);

    return this.#toOrderDTO(updatedOrder);
  }

  async checkout(orderId) {
    const orderDTO = await this.orderRepository.findById(orderId);
    const order = this.#toOrderEntity(orderDTO);

    order.setStatus(OrderStatus.PENDING_PAYMENT);

    // Fake Checkout: Pagamento não implementado - Mudando para pago
    order.setStatus(OrderStatus.PAYED);

    await this.orderRepository.updateOrder(this.#toOrderDTO(order));
  }

  #generateCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  #toOrderEntity(orderDTO) {
    return new Order({
      id: orderDTO.id,
      createdAt: orderDTO.createdAt,
      code: orderDTO.code,
      customerId: orderDTO.customerId,
      status: orderDTO.status,
      totalPrice: orderDTO.status,
      items: orderDTO.items
    });
  }

  #toOrderDTO(orderEntity) {
    return new OrderDTO({
      id: orderEntity.getId(),
      elapsedTime: orderEntity.getElapsedTime(),
      code: orderEntity.getCode(),
      status: orderEntity.getStatus(),
      totalPrice: orderEntity.getTotalPrice(),
      items: orderEntity.getItems().map(this.#toItemDTO),
      customerId: orderEntity.getCustomerId()
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
