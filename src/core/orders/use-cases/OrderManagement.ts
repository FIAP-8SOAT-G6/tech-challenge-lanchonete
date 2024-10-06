import Order from "../entities/Order";
import { OrderStatus } from "../entities/OrderStatus";

import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";

import ItemDTO from "../dto/ItemDTO";
import OrderDTO from "../dto/OrderDTO";

import CustomerRepository from "../../ports/CustomerRepository";
import OrderManagementPort from "../../ports/OrderManagement";
import OrderRepository from "../../ports/OrderRepository";
import ProductRepository from "../../ports/ProductRepository";
import Item from "../entities/Item";

export default class OrderManagement implements OrderManagementPort {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    private customerRepository: CustomerRepository
  ) {}

  async create(orderDTO: OrderDTO): Promise<OrderDTO> {
    const { customerId } = orderDTO;

    if (!this.#isCustomerAnonymous(customerId!))
      await this.#validateCustomerExists(customerId!);

    const order = new Order({
      status: OrderStatus.CREATED,
      code: this.#generateCode(),
      customerId: customerId!
    });
    const createdOrderDTO = await this.orderRepository.create(
      this.#toOrderDTO(order)
    );
    const completeOrderDTO = await this.orderRepository.findById(
      createdOrderDTO.id!
    );
    const completeOrder = this.#toOrderEntity(completeOrderDTO!);

    return this.#toOrderDTO(completeOrder);
  }

  async getOrders(): Promise<OrderDTO[]> {
    const repositoryOrderDTOs = await this.orderRepository.findAll();
    const orders = repositoryOrderDTOs!.map(this.#toOrderEntity);
    return orders.map(this.#toOrderDTO.bind(this));
  }

  async getOrder(orderId: number): Promise<OrderDTO> {
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

  async addItem(orderId: number, itemDTO: ItemDTO): Promise<OrderDTO> {
    const { productId, quantity } = itemDTO;

    const [productDTO, orderDTO] = await Promise.all([
      this.productRepository.findById(productId!),
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
      productId: productDTO.id!,
      quantity: quantity!,
      unitPrice: productDTO.price!
    });

    await this.orderRepository.createItem(
      this.#toOrderDTO(order),
      this.#toItemDTO(item)
    );

    const updatedOrderDTO = await this.orderRepository.findById(orderId);
    const updatedOrder = this.#toOrderEntity(updatedOrderDTO!);

    return this.#toOrderDTO(updatedOrder);
  }

  async removeItem(orderId: number, itemId: number): Promise<undefined> {
    const orderDTO = await this.orderRepository.findById(orderId);
    const order = this.#toOrderEntity(orderDTO!);
    order.removeItem(itemId);
    await this.orderRepository.removeItem(orderId, itemId);
  }

  async updateItem(
    orderId: number,
    itemId: number,
    itemDTO: ItemDTO
  ): Promise<OrderDTO> {
    const orderDTO = await this.orderRepository.findById(orderId);

    if (!orderDTO)
      throw new ResourceNotFoundError(
        ResourceNotFoundError.Resources.Order,
        "id",
        orderId
      );
    const order = this.#toOrderEntity(orderDTO);
    const quantity = itemDTO.quantity!;
    const updatedItem = order.updateItem(itemId, { quantity });
    await this.orderRepository.updateItem(itemId, this.#toItemDTO(updatedItem));

    const updatedOrderDTO = await this.orderRepository.findById(orderId);
    const updatedOrder = this.#toOrderEntity(updatedOrderDTO!);

    return this.#toOrderDTO(updatedOrder);
  }

  async checkout(orderId: number): Promise<void> {
    const orderDTO = await this.orderRepository.findById(orderId);
    const order = this.#toOrderEntity(orderDTO!);

    order.setStatus(OrderStatus.PENDING_PAYMENT);

    // Fake Checkout: Pagamento não implementado - Mudando para pago
    order.setStatus(OrderStatus.PAYED);

    await this.orderRepository.updateOrder(this.#toOrderDTO(order));
  }

  #isCustomerAnonymous(customerId: number | null) {
    return customerId === null;
  }

  async #validateCustomerExists(customerId: number) {
    const customerDTO = await this.customerRepository.findById(customerId);
    if (!customerDTO)
      throw new ResourceNotFoundError(
        ResourceNotFoundError.Resources.Customer,
        "id",
        customerId
      );
  }

  #generateCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  #toOrderEntity(orderDTO: OrderDTO) {
    return new Order({
      id: orderDTO.id,
      createdAt: orderDTO.createdAt,
      code: orderDTO.code!,
      customerId: orderDTO.customerId!,
      status: orderDTO.status!,
      totalPrice: orderDTO.totalPrice!,
      items: orderDTO.items
    });
  }

  #toOrderDTO(orderEntity: Order) {
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

  #toItemDTO(itemEntity: Item) {
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
