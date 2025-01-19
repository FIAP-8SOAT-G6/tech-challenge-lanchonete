import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import OrderGateway from "../../interfaces/OrderGateway";
import DeleteItem from "../interfaces/DeleteItem";
import OrderMapper from "../mappers/OrderMappers";

export default class DeleteItemUseCase implements DeleteItem {
  constructor(private orderGateway: OrderGateway) {}

  async deleteItem(orderId: number, itemId: number): Promise<undefined> {
    const orderDTO = await this.orderGateway.getOrder(orderId);
    this.#validateOrderExists(orderDTO?.id!, orderId);

    const order = OrderMapper.toOrderEntity(orderDTO!);
    order.removeItem(itemId);
    await this.orderGateway.deleteItem(orderId, itemId);
  }

  #validateOrderExists(orderIdFound: number, orderIdReceived: number) {
    if (!orderIdFound) throw new ResourceNotFoundError(ResourceNotFoundError.Resources.Order, "id", orderIdReceived);
  }
}
