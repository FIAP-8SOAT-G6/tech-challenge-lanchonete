import OrderGateway from "../../interfaces/OrderGateway";
import OrderDTO from "../dto/OrderDTO";
import { OrderStatus } from "../entities/OrderStatus";
import GetOrders from "../interfaces/GetOrders";
import { OrderMapper } from "../mappers/OrderMappers";

export default class GetOrdersUseCase implements GetOrders {
  constructor(private orderGateway: OrderGateway) {}

  async getOrders(): Promise<OrderDTO[] | []> {
    const { DONE, PREPARING, RECEIVED } = OrderStatus;
    const repositoryOrderDoneDTOs = await this.orderGateway.getOrdersByStatusAndSortByAscDate(DONE);
    const repositoryOrderPreparingDTOs = await this.orderGateway.getOrdersByStatusAndSortByAscDate(PREPARING);
    const repositoryOrderReceivedDTOs = await this.orderGateway.getOrdersByStatusAndSortByAscDate(RECEIVED);

    const ordersDTOs = [...repositoryOrderDoneDTOs, ...repositoryOrderPreparingDTOs, ...repositoryOrderReceivedDTOs];

    const ordersEntitys = ordersDTOs.map(OrderMapper.toOrderEntity);
    return ordersEntitys.map(OrderMapper.toOrderDTO);
  }
}
