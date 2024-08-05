const Customer = require('../../core/customers/entities/Customer');

class FakeCustomerRepository {
  #customer = [];

  async create(customer) {
    const { name, cpf, email } = customer;
    const newCustomer = {
      id: this.#customer.length + 1,
      name,
      cpf,
      email,
    };
    this.#customer.push(newCustomer);
    return Promise.resolve(this.#instantiateCustomer(newCustomer));
  }

  async findByCPF(cpf) {
    const customer = this.#customer.find((customer) => customer?.cpf === cpf);
    return Promise.resolve(this.#instantiateCustomer(customer));
  }

  #instantiateCustomer(dbCustomer) {
    if (!dbCustomer) return undefined;

    const { id, name, cpf, email } = dbCustomer;
    return new Customer({ id, name, cpf, email });
  }
}

module.exports = FakeCustomerRepository;
