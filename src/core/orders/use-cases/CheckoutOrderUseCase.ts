import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import OrderGateway from "../../gateways/OrderGateway";
import ItemDTO from "../dto/ItemDTO";
import OrderDTO from "../dto/OrderDTO";
import Item from "../entities/Item";
import Order from "../entities/Order";
import { OrderStatus } from "../entities/OrderStatus";
import CheckoutOrder from "../interfaces/CheckoutOrder";

export default class CheckoutOrderUseCase implements CheckoutOrder {
  constructor(private orderGateway: OrderGateway) {}

  async checkout(orderId: number): Promise<void> {
    const orderDTO = await this.orderGateway.getOrder(orderId);
    this.#validateOrderExists(orderDTO?.id!, orderId);
    const order = this.#toOrderEntity(orderDTO!);

    order.setStatus(OrderStatus.PENDING_PAYMENT);

    // Fake Checkout: Pagamento não implementado - Mudando para pago
    order.setStatus(OrderStatus.PAYED);

    await this.orderGateway.updateOrder(this.#toOrderDTO(order));
  }

  #validateOrderExists(orderIdFound: number, orderIdReceived: number) {
    if (!orderIdFound) throw new ResourceNotFoundError(ResourceNotFoundError.Resources.Order, "id", orderIdReceived);
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
