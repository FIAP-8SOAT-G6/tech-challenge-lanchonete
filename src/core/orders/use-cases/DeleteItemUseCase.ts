import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import OrderGateway from "../../gateways/OrderGateway";
import OrderDTO from "../dto/OrderDTO";
import Order from "../entities/Order";
import DeleteItem from "../interfaces/DeleteItem";

export default class DeleteItemUseCase implements DeleteItem {
  constructor(private orderGateway: OrderGateway) {}

  async deleteItem(orderId: number, itemId: number): Promise<undefined> {
    const orderDTO = await this.orderGateway.getOrder(orderId);
    this.#validateOrderExists(orderDTO?.id!, orderId);

    const order = this.#toOrderEntity(orderDTO!);
    order.removeItem(itemId);
    await this.orderGateway.deleteItem(orderId, itemId);
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
