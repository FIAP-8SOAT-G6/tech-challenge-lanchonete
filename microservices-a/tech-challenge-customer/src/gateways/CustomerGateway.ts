import { CustomerDataSource } from "../interfaces/DataSources";
import CustomerGatewayInterface from "../core/interfaces/CustomerGateway";
import CustomerDTO from "../core/customers/dto/CustomerDTO";

export default class CustomerGateway implements CustomerGatewayInterface {
  constructor(private readonly dataSource: CustomerDataSource) {}

  async create(customerDTO: CustomerDTO): Promise<CustomerDTO | undefined> {
    const createdCustomer = await this.dataSource.create(customerDTO);
    return createdCustomer;
  }

  async findByCPF(cpf: string): Promise<CustomerDTO | undefined> {
    const customer = await this.dataSource.findByProperties({ cpf });
    if (!customer) return undefined;
    return customer[0];
  }

  async findById(id: number): Promise<CustomerDTO | undefined> {
    const customer = await this.dataSource.findByProperties({ id });
    if (!customer) return undefined;
    return customer[0];
  }
}
