import CustomerDTO from "../core/customers/dto/CustomerDTO";
import CustomerGateway from "../core/interfaces/CustomerGateway";

type FakeCustomer = {
  id: number;
  name?: string;
  cpf?: string;
  email?: string;
};

export default class FakeCustomerGateway implements CustomerGateway {
  private readonly customers: FakeCustomer[] = [];

  async create(customerDTO: CustomerDTO): Promise<CustomerDTO | undefined> {
    const { name, cpf, email } = customerDTO;
    const newCustomer = {
      id: this.customers.length + 1,
      name,
      cpf,
      email,
    };
    this.customers.push(newCustomer);
    return Promise.resolve(this.#createCustomerDTO(newCustomer));
  }

  async findByCPF(cpf: string): Promise<CustomerDTO | undefined> {
    const customer = this.customers.find((customer) => customer.cpf === cpf);
    return Promise.resolve(this.#createCustomerDTO(customer));
  }

  async findById(id: number): Promise<CustomerDTO | undefined> {
    const customer = this.customers.find((customer) => customer.id === id);
    return Promise.resolve(this.#createCustomerDTO(customer));
  }

  #createCustomerDTO(dbCustomer?: FakeCustomer) {
    if (!dbCustomer) return undefined;

    const { id, name, cpf, email } = dbCustomer;
    return new CustomerDTO({ id, name, cpf, email });
  }
}
