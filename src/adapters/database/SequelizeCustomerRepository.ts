import CustomerDTO from "../../core/customers/dto/CustomerDTO";
import CustomerRepository from "../../core/ports/CustomerRepository";
import SequelizeCustomer from "../../infrastructure/database/models/customer";

export default class SequelizeCustomerRepository implements CustomerRepository {
  async create(customerDTO: CustomerDTO): Promise<CustomerDTO | undefined> {
    const { name, cpf, email } = customerDTO as Required<CustomerDTO>;
    const newCustomer = await SequelizeCustomer.create({
      name,
      cpf,
      email
    });
    return this.#createCustomerDTO(newCustomer);
  }

  async findByCPF(cpf: string): Promise<CustomerDTO | undefined> {
    const customer = await SequelizeCustomer.findOne({
      where: { cpf: cpf }
    });
    return this.#createCustomerDTO(customer);
  }

  async findById(id: number): Promise<CustomerDTO | undefined> {
    const customer = await SequelizeCustomer.findByPk(id);
    return this.#createCustomerDTO(customer);
  }

  #createCustomerDTO(dbCustomer: any) {
    if (!dbCustomer) return undefined;

    const { id, name, cpf, email } = dbCustomer;
    return new CustomerDTO({ id, name, cpf, email });
  }
}
