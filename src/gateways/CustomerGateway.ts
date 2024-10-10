import { CustomerDataSource } from "../interfaces/DataSources";
import CustomerGatewayInterface from "../core/gateways/CustomerGateway";
import CustomerDTO from "../core/customers/dto/CustomerDTO";

export default class CustomerGateway implements CustomerGatewayInterface {
  constructor(private dataSource: CustomerDataSource) {}

  async create(customerDTO: CustomerDTO): Promise<CustomerDTO | undefined> {
    const createdCustomer = await this.dataSource.create(customerDTO);
    return createdCustomer;
  }

  async findByCPF(cpf: string): Promise<CustomerDTO | undefined> {
    const customer = await this.dataSource.findByProperies({ cpf });
    if (customer) return customer[0];
    return undefined;
  }

  async findById(id: number): Promise<CustomerDTO | undefined> {
    const customer = await this.dataSource.findByProperies({ id });
    if (customer) return customer[0];
    return undefined;
  }
}
