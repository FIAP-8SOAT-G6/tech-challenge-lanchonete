import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import CustomerGateway from "../../gateways/CustomerGateway";
import OrderGateway from "../../gateways/OrderGateways";
import ItemDTO from "../dto/ItemDTO";
import OrderDTO from "../dto/OrderDTO";
import Item from "../entities/Item";
import Order from "../entities/Order";
import { OrderStatus } from "../entities/OrderStatus";
import CreateOrder from "../interfaces/CreateOrder";

export default class CreateOrderUseCase implements CreateOrder {
  constructor(
    private orderGateway: OrderGateway,
    private customerGateWay: CustomerGateway
  ) {}

  async createOrder(orderDTO: OrderDTO): Promise<OrderDTO> {
    const { customerId } = orderDTO;

    if (!this.isCustomerAnonymous(customerId!)) await this.validateCustomerExists(customerId!);

    const order = new Order({
      status: OrderStatus.CREATED,
      code: this.generateCode(),
      customerId: customerId!
    });
    const createdOrderDTO = await this.orderGateway.createOrder(this.toOrderDTO(order));
    const completeOrderDTO = await this.orderGateway.getOrder(createdOrderDTO.id!);
    const completeOrder = this.toOrderEntity(completeOrderDTO!);

    return this.toOrderDTO(completeOrder);
  }

  private isCustomerAnonymous(customerId: number | null) {
    return customerId === null;
  }

  private async validateCustomerExists(customerId: number) {
    const customerDTO = await this.customerGateWay.findById(customerId);
    if (!customerDTO) throw new ResourceNotFoundError(ResourceNotFoundError.Resources.Customer, "id", customerId);
  }

  private generateCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  private toOrderDTO(orderEntity: Order) {
    return new OrderDTO({
      id: orderEntity.getId(),
      createdAt: orderEntity.getCreatedAt(),
      code: orderEntity.getCode(),
      totalPrice: orderEntity.getTotalPrice(),
      items: orderEntity.getItems().map(this.toItemDTO),
      customerId: orderEntity.getCustomerId(),
      status: orderEntity.getStatus(),
      paymentStatus: orderEntity.getPaymentStatus(),
      elapsedTime: orderEntity.getElapsedTime()
    });
  }

  private toItemDTO(itemEntity: Item) {
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

  private toOrderEntity(orderDTO: OrderDTO) {
    return new Order({
      id: orderDTO.id,
      createdAt: orderDTO.createdAt,
      code: orderDTO.code!,
      customerId: orderDTO.customerId!,
      status: orderDTO.status!,
      paymentStatus: orderDTO.paymentStatus!,
      totalPrice: orderDTO.totalPrice,
      items: orderDTO.items
    });
  }
}
