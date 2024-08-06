const Customer = require("../entities/Customer");
const NonexistentCustomerError = require("../exceptions/NonexistentCustomerError");
const ExistentCustomerError = require("../exceptions/ExistentCustomerError");
const MissingPropertyError = require("../exceptions/MissingPropertyError");

class CustomerManagement {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async create({ customer }) {
    const { name, cpf, email } = customer;
    await this.validateCustomerExistence({ cpf });

    const newCustomer = new Customer({ name, cpf, email });
    return await this.customerRepository.create({ customer: newCustomer });
  }

  async findByCPF({ cpf }) {
    if (!cpf) throw new MissingPropertyError({ property: "cpf" });

    const customer = await this.customerRepository.findByCPF({ cpf });
    if (!customer) throw new NonexistentCustomerError({ cpf });

    return customer;
  }

  async validateCustomerExistence({ cpf }) {
    const validateCustomerExistence = await this.customerRepository.findByCPF({
      cpf
    });

    if (validateCustomerExistence) {
      throw new ExistentCustomerError({ cpf });
    }
  }
}

module.exports = CustomerManagement;
