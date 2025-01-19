import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import CustomerGateway from "../../interfaces/CustomerGateway";
import OrderGateway from "../../interfaces/OrderGateway";
import OrderDTO from "../dto/OrderDTO";
import Order from "../entities/Order";
import { OrderStatus } from "../entities/OrderStatus";
import CreateOrder from "../interfaces/CreateOrder";
import OrderMapper from "../mappers/OrderMappers";

export default class CreateOrderUseCase implements CreateOrder {
  constructor(
    private orderGateway: OrderGateway,
    private customerGateWay: CustomerGateway
  ) {}

  async createOrder(orderDTO: OrderDTO): Promise<OrderDTO> {
    const { customerId } = orderDTO;

    if (!this.isCustomerAnonymous(customerId!)) await this.validateCustomerExists(customerId!);

    const order = new Order({
      status: OrderStatus.CREATED,
      code: this.generateCode(),
      customerId: customerId!
    });
    const createdOrderDTO = await this.orderGateway.createOrder(OrderMapper.toOrderDTO(order));
    const completeOrderDTO = await this.orderGateway.getOrder(createdOrderDTO.id!);
    const completeOrder = OrderMapper.toOrderEntity(completeOrderDTO!);

    return OrderMapper.toOrderDTO(completeOrder);
  }

  private isCustomerAnonymous(customerId: number | null) {
    return customerId === null;
  }

  private async validateCustomerExists(customerId: number) {
    const customerDTO = await this.customerGateWay.findById(customerId);
    if (!customerDTO) throw new ResourceNotFoundError(ResourceNotFoundError.Resources.Customer, "id", customerId);
  }

  private generateCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
