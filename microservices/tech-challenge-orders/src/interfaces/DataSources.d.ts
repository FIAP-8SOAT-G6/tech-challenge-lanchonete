import CustomerDTO from "../../core/customers/dto/CustomerDTO";
import ProductDTO from "../core/products/dto/ProductDTO";

type IndexedObject = { [key: string]: any };

export interface OrderDataSource {
  create(orderDTO: OrderDTO): Promise<OrderDTO>;

  findById(id: number): Promise<OrderDTO | undefined>;
  findAll(): Promise<OrderDTO[]>;
  findOrdersByStatusAndSortByAscDate(status: string): Promise<OrderDTO[]>;

  updateOrder(orderDTO: OrderDTO): Promise<OrderDTO>;

  createItem(orderDTO: OrderDTO, itemDTO: ItemDTO);
  updateItem(itemId: number, itemDTO: ItemDTO);
  removeItem(orderId: number, itemId: number);
}