import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import OrderGateway from "../../interfaces/OrderGateway";
import OrderDTO from "../dto/OrderDTO";
import GetOrder from "../interfaces/GetOrder";
import OrderMapper from "../mappers/OrderMappers";

export default class GetOrderUseCase implements GetOrder {
  constructor(private readonly orderGateway: OrderGateway) {}

  async getOrder(orderId: number): Promise<OrderDTO | undefined> {
    const repositoryOrderDTO = await this.orderGateway.getOrder(orderId);
    this.#validateOrderExists(repositoryOrderDTO?.id!, orderId);

    const order = OrderMapper.toOrderEntity(repositoryOrderDTO!);
    return OrderMapper.toOrderDTO(order);
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
