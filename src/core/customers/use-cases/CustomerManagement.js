const Customer = require("../entities/Customer");
const NonexistentCustomerError = require("../exceptions/NonexistentCustomerError");
const ExistentCustomerError = require("../exceptions/ExistentCustomerError");
const MissingPropertyError = require("../exceptions/MissingPropertyError");
//const InvalidCPFError = require("../exceptions/InvalidCPFError");

class CustomerManagement {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async create({ customer }) {
    const { name, cpf, email } = customer;

    await this.existCustomer({ cpf });
    //await this.isCPFValid(cpf);

    const newCustomer = new Customer({ id: null, name, cpf, email });
    return await this.customerRepository.create({ customer: newCustomer });
  }

  async findByCPF({ cpf }) {
    if (!cpf) throw new MissingPropertyError({ property: cpf });

    const customer = await this.customerRepository.findByCPF({ cpf });
    if (!customer) throw new NonexistentCustomerError({ cpf });

    return customer;
  }

  async existCustomer({ cpf }) {
    const existCustomer = await this.customerRepository.findByCPF({ cpf });

    if (existCustomer) {
      throw new ExistentCustomerError({ cpf });
    }
  }

  // async isCPFValid(cpf) {
  //   const existCustomer = true;

  //   if (existCustomer) throw new InvalidCPFError(cpf);
  // }
}

module.exports = CustomerManagement;
