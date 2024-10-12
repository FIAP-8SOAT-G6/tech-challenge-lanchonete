import CustomerDTO from "../../core/customers/dto/CustomerDTO";
import ProductDTO from "../core/products/dto/ProductDTO";

type IndexedObject = { [key: string]: any };

export interface CustomerDataSource {
  create(customerDTO: CustomerDTO): Promise<CustomerDTO>;
  findByProperies(properties: IndexedObject): Promise<CustomerDTO[] | undefined>;
}

export interface OrderDataSource {
  //interfaces dos metodos do banco
  create(orderDTO: OrderDTO): Promise<OrderDTO>;

  findById(id: number): Promise<OrderDTO | undefined>;
  findAll(): Promise<OrderDTO[] | undefined>;
  findOrdersByStatusAndSortByAscDate(status: string): Promise<OrderDTO[] | []>;

  updateOrder(orderDTO: OrderDTO): Promise<OrderDTO>;

  createItem(orderDTO: OrderDTO, itemDTO: ItemDTO);
  updateItem(itemId: number, itemDTO: ItemDTO);
  removeItem(orderId: number, itemId: number);
}

export interface ProductDataSource {
  create(productDTO: ProductDTO): Promise<ProductDTO>;

  findAll(): Promise<ProductDTO[] | undefined>;
  findById(id: number): Promise<ProductDTO | undefined>;
  findByCategory(status: string): Promise<ProductDTO[] | []>;

  update(productDTO: ProductDTO): Promise<ProductDTO | undefined>;
  delete(id: number);
}