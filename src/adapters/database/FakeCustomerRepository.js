const CustomerDTO = require("../../core/customers/dto/CustomerDTO");

class FakeCustomerRepository {
  #customer = [];

  async create(customer) {
    const { name, cpf, email } = customer;
    const newCustomer = {
      id: this.#customer.length + 1,
      name,
      cpf,
      email
    };
    this.#customer.push(newCustomer);
    return Promise.resolve(this.#createCustomerDTO(newCustomer));
  }

  async findByCPF(cpf) {
    const customer = this.#customer.find((customer) => customer?.cpf === cpf);
    return Promise.resolve(this.#createCustomerDTO(customer));
  }

  async findById(id) {
    const customer = this.#customer.find((customer) => customer.id === id);
    return Promise.resolve(this.#createCustomerDTO(customer));
  }

  #createCustomerDTO(dbCustomer) {
    if (!dbCustomer) return undefined;

    const { id, name, cpf, email } = dbCustomer;
    return new CustomerDTO({ id, name, cpf, email });
  }
}

module.exports = FakeCustomerRepository;
