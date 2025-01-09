import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import OrderGateway from "../../interfaces/OrderGateway";
import PaymentGateway from "../../interfaces/PaymentGateway";
import ItemDTO from "../dto/ItemDTO";
import OrderDTO from "../dto/OrderDTO";
import PaymentDTO from "../dto/PaymentDTO";
import Item from "../entities/Item";
import Order from "../entities/Order";
import { OrderPaymentsStatus } from "../entities/OrderPaymentsStatus";
import { OrderStatus } from "../entities/OrderStatus";
import ProcessOrderPayment from "../interfaces/UpdateOrderPaymentStatus";

export default class ProcessOrderPaymentUseCase implements ProcessOrderPayment {
  constructor(
    private readonly orderGateway: OrderGateway,
    private readonly paymentGateway: PaymentGateway
  ) {}

  async updateOrderPaymentStatus(paymentDTO: PaymentDTO): Promise<OrderDTO> {
    const { paymentId } = paymentDTO;
    const detailedPaymentDTO = await this.paymentGateway.getPaymentDetails(paymentId!);

    this.#validateEntityIDExists(detailedPaymentDTO?.paymentId, ResourceNotFoundError.Resources.Payment, paymentId!);

    const { orderId, paymentStatus } = detailedPaymentDTO;
    const orderDTO = await this.orderGateway.getOrder(orderId);

    this.#validateEntityIDExists(orderDTO?.id!, ResourceNotFoundError.Resources.Order, orderId);

    const order = this.#toOrderEntity(orderDTO!);
    order.setPaymentStatus(paymentStatus);

    if (order.getPaymentStatus() === OrderPaymentsStatus.APPROVED) {
      order.setStatus(OrderStatus.PAYED);
    }

    return await this.orderGateway.updateOrder(this.#toOrderDTO(order));
  }

  #validateEntityIDExists(idFound: number, type: string, idReceived: number) {
    if (!idFound) {
      throw new ResourceNotFoundError(type, "id", idReceived);
    }
  }

  #toOrderEntity(orderDTO: OrderDTO) {
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

  #toOrderDTO(orderEntity: Order) {
    return new OrderDTO({
      id: orderEntity.getId(),
      createdAt: orderEntity.getCreatedAt(),
      code: orderEntity.getCode(),
      totalPrice: orderEntity.getTotalPrice(),
      items: orderEntity.getItems().map(this.#toItemDTO),
      customerId: orderEntity.getCustomerId(),
      status: orderEntity.getStatus(),
      paymentStatus: orderEntity.getPaymentStatus(),
      elapsedTime: orderEntity.getElapsedTime()
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
