import CustomerGatewayInterface from "../core/interfaces/CustomerGateway";
import CustomerDTO from "../core/customers/dto/CustomerDTO";
import { CustomersSource } from "../interfaces/CustomersSource";

export default class CustomerGateway implements CustomerGatewayInterface {
  constructor(private readonly dataSource: CustomersSource) {}

  async findById(id: number): Promise<CustomerDTO | undefined> {
    const customer = await this.dataSource.findByID(id);
    if (!customer) return undefined;
    return customer;
  }
}
