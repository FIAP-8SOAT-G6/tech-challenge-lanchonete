import OrderGateway from "../../interfaces/OrderGateway";
import ItemDTO from "../dto/ItemDTO";
import OrderDTO from "../dto/OrderDTO";
import Item from "../entities/Item";
import Order from "../entities/Order";
import { OrderStatus } from "../entities/OrderStatus";
import GetOrders from "../interfaces/GetOrders";

export default class GetOrdersUseCase implements GetOrders {
  constructor(private orderGateway: OrderGateway) {}

  async getOrders(): Promise<OrderDTO[] | []> {
    const { DONE, PREPARING, RECEIVED } = OrderStatus;
    const repositoryOrderDoneDTOs = await this.orderGateway.getOrdersByStatusAndSortByAscDate(DONE);
    const repositoryOrderPreparingDTOs = await this.orderGateway.getOrdersByStatusAndSortByAscDate(PREPARING);
    const repositoryOrderReceivedDTOs = await this.orderGateway.getOrdersByStatusAndSortByAscDate(RECEIVED);

    const ordersDTOs = [...repositoryOrderDoneDTOs, ...repositoryOrderPreparingDTOs, ...repositoryOrderReceivedDTOs];

    const ordersEntitys = ordersDTOs.map(this.#toOrderEntity);
    return ordersEntitys.map(this.#toOrderDTO.bind(this));
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
