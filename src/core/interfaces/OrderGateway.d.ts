import ItemDTO from "../orders/dto/ItemDTO";
import OrderDTO from "../orders/dto/OrderDTO";

export default interface OrderGateway {
  createOrder(orderDTO: OrderDTO): Promise<OrderDTO>;

  getOrdersByStatusAndSortByAscDate(status: string): Promise<OrderDTO[] | []>;
  getOrder(orderId: number): Promise<OrderDTO | undefined>;
  getOrdersAll(): Promise<OrderDTO[] | undefined>;
  getPaymentStatus(orderId: number): Promise<string>;

  updateOrder(orderDTO: OrderDTO): Promise<OrderDTO>;
  updateOrderStatus(orderId: number, status: string): Promise<OrderDTO>;

  addItem(orderDTO: OrderDTO, itemDTO: ItemDTO);
  updateItem(itemId: number, updateItemDTO: ItemDTO);
  deleteItem(orderId: number, itemId: number);
}
