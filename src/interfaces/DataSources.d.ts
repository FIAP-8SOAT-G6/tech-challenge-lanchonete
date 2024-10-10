import CustomerDTO from "../../core/customers/dto/CustomerDTO";

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
  removeItem(itemId: number, itemDTO: ItemDTO);
}
