import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import OrderGateway from "../../interfaces/OrderGateway";
import OrderDTO from "../dto/OrderDTO";
import UpdateOrderStatus from "../interfaces/UpdateOrderStatus";
import OrderMapper from "../mappers/OrderMappers";

export default class UpdateOrderStatusUseCase implements UpdateOrderStatus {
  constructor(private readonly orderGateway: OrderGateway) {}

  async updateOrderStatus(orderId: number, status: string): Promise<OrderDTO> {
    const orderDTO = await this.orderGateway.getOrder(orderId!);
    this.#validateOrderExists(orderDTO?.id!, orderId);

    const order = OrderMapper.toOrderEntity(orderDTO!);
    order.setStatus(status);
    return await this.orderGateway.updateOrder(OrderMapper.toOrderDTO(order));
  }

  #validateOrderExists(orderIdFound: number, orderIdReceived: number) {
    if (!orderIdFound)
      throw new ResourceNotFoundError(
        ResourceNotFoundError.Resources.Order,
        "id",
        orderIdReceived
      );
  }
}
