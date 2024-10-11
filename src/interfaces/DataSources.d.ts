import CustomerDTO from "../../core/customers/dto/CustomerDTO";

type IndexedObject = { [key: string]: any };

export interface CustomerDataSource {
  create(customerDTO: CustomerDTO): Promise<CustomerDTO>;
  findByProperies(properties: IndexedObject): Promise<CustomerDTO[] | undefined>;
}
