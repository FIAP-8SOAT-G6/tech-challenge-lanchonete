import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import OrderGateway from "../../interfaces/OrderGateway";
import ItemDTO from "../dto/ItemDTO";
import OrderDTO from "../dto/OrderDTO";
import UpdateItem from "../interfaces/UpdateItem";
import { OrderMapper } from "../mappers/OrderMappers";

export default class UpdateItemUseCase implements UpdateItem {
  constructor(private orderGateway: OrderGateway) {}

  async updateItem(orderId: number, itemId: number, itemDTO: ItemDTO): Promise<OrderDTO> {
    const orderDTO = await this.orderGateway.getOrder(orderId);

    this.#validateOrderExists(orderDTO?.id!, orderId);
    const order = OrderMapper.toOrderEntity(orderDTO!);
    const quantity = itemDTO.quantity!;
    const updatedItem = order.updateItem(itemId, { quantity });
    await this.orderGateway.updateItem(itemId, OrderMapper.toItemDTO(updatedItem));

    const updatedOrderDTO = await this.orderGateway.getOrder(orderId);
    const updatedOrder = OrderMapper.toOrderEntity(updatedOrderDTO!);

    return OrderMapper.toOrderDTO(updatedOrder);
  }

  #validateOrderExists(orderIdFound: number, orderIdReceived: number) {
    if (!orderIdFound) throw new ResourceNotFoundError(ResourceNotFoundError.Resources.Order, "id", orderIdReceived);
  }
}
