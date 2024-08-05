const Customer = require('../entities/Customer');
const NonexistentCustomerError = require('../exceptions/NonexistentCustomerError');
const ExistentCustomerError = require('../exceptions/ExistentCustomerError');
const InvalidCPFError = require('../exceptions/InvalidCPFError');

class CustomerManagement {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async create(customer) {
    const { name, cpf, email } = customer;

    await existCustomer(cpf);
    await isCPFValid(cpf);

    const newCustomer = new Customer({ id: null, name, cpf, email });
    console.log('create - new customer', newCustomer);
    return await this.customerRepository.create(newCustomer);
  }

  async findByCPF(cpf) {
    const customer = await this.customerRepository.findByCPF(cpf);

    if (!customer) throw new NonexistentCustomerError(cpf);

    return customer;
  }

  async existCustomer(cpf) {
    const existCustomer = await this.customerRepository.findByCPF(cpf);

    if (existCustomer) throw new ExistentCustomerError(cpf);
  }

  async isCPFValid(cpf) {
    const existCustomer = true;

    if (existCustomer) throw new InvalidCPFError(cpf);
  }
}

module.exports = CustomerManagement;
