import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import OrderGateway from "../../gateways/OrderGateway";
import OrderDTO from "../dto/OrderDTO";
import Order from "../entities/Order";
import GetPaymentStatus from "../interfaces/GetPaymentStatus";

export default class GetPaymentStatusUseCase implements GetPaymentStatus {
  constructor(private orderGateway: OrderGateway) {}

  async getPaymentStatus(orderId: number): Promise<string> {
    const repositoryOrderDTO = await this.orderGateway.getOrder(orderId);
    this.#validateOrderExists(repositoryOrderDTO?.id!, orderId);

    const order = this.#toOrderEntity(repositoryOrderDTO!);
    return order.getPaymentStatus();
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
}
