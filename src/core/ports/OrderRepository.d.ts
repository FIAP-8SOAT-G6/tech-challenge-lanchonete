import ItemDTO from "../../core/orders/dto/ItemDTO";
import OrderDTO from "../../core/orders/dto/OrderDTO";

export default interface OrderRepository {
  create(orderDTO: OrderDTO): Promise<OrderDTO>;
  findById(id: number): Promise<OrderDTO | undefined>;
  findAll(): Promise<OrderDTO[] | undefined>;
  createItem(order: OrderDTO, itemDTO: ItemDTO): Promise;
  removeItem(orderId: number, itemId: number): Promise;
  updateItem(itemId: number, itemDTO: ItemDTO): Promise;
  updateOrder(orderDTO: OrderDTO): Promise<OrderDTO | undefined>;
}
