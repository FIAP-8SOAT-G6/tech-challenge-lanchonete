import OrderDTO from "../dto/OrderDTO";
import ItemDTO from "../dto/ItemDTO";

export default interface OrderManagement {
  create(orderDTO: OrderDTO): Promise<OrderDTO>;

  getOrders(): Promise<OrderDTO[]>;

  getOrdersAll(): Promise<OrderDTO[] | []>;

  getOrder(orderId: number): Promise<OrderDTO | undefined>;

  addItem(orderId: number, itemDTO: ItemDTO): Promise<OrderDTO>;

  removeItem(orderId: number, itemId: number): Promise<undefined>;

  updateItem(orderId: number, itemId: number, itemDTO: ItemDTO): Promise<OrderDTO>;

  checkout(orderId: number): Promise<OrderDTO>;
}
