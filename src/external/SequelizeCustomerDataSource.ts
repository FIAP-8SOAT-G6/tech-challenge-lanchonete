import CustomerDTO from "../core/customers/dto/CustomerDTO";
import Customer from "../infrastructure/database/models/customer";
import { CustomerDataSource, IndexedObject } from "../interfaces/DataSources";

export default class SequelizeCustomerDataSource implements CustomerDataSource {
  async create(customerDTO: CustomerDTO): Promise<CustomerDTO> {
    const customer = await Customer.create({
      cpf: customerDTO.cpf!,
      email: customerDTO.email!,
      name: customerDTO.name!
    });
    return this.createCustomerDTO(customer)!;
  }

  async findByProperies(properties: IndexedObject): Promise<CustomerDTO[]> {
    const customers = await Customer.findAll({
      where: {
        ...properties
      }
    });

    return customers.map(this.createCustomerDTO) as CustomerDTO[];
  }

  private createCustomerDTO(dbCustomer: any) {
    if (!dbCustomer) return undefined;

    const { id, name, cpf, email } = dbCustomer;
    return new CustomerDTO({ id, name, cpf, email });
  }
}
