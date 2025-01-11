import OrderGateway from "../../interfaces/OrderGateway";
import OrderDTO from "../dto/OrderDTO";
import GetOrdersAll from "../interfaces/GetOrdersAll";
import { OrderMapper } from "../mappers/OrderMappers";

export default class GetOrdersAllUseCase implements GetOrdersAll {
  constructor(private orderGateway: OrderGateway) {}

  async getOrdersAll(): Promise<OrderDTO[] | []> {
    const orderDTOs = await this.orderGateway.getOrdersAll();
    if (!orderDTOs || orderDTOs.length === 0) return [];

    const ordersEntities = orderDTOs.map(OrderMapper.toOrderEntity);
    return ordersEntities.map(OrderMapper.toOrderDTO);
  }
}
