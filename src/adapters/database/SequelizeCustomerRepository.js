const Customer = require('../../core/customers/entities/Customer');
const { sequelize } = require('../../infrastructure/database/models');

const { Customer: SequelizeCustomer } = sequelize.models;

class SequelizeCustomerRepository {
  async create(customer) {
    const { name, cpf, email } = customer;
    const newCustomer = await SequelizeCustomer.create({
      name,
      cpf,
      email,
    });
    return this.#instantiateCustomer(newCustomer);
  }

  async findByCPF(cpf) {
    const customer = await SequelizeCustomer.findAll({
      where: { cpf: cpf },
    });
    return this.#instantiateCustomer(customer);
  }

  #instantiateCustomer(dbCustomer) {
    if (!dbCustomer) return undefined;

    const { id, name, cpf, email } = dbCustomer;
    return new Customer({ id, name, cpf, email });
  }
}

module.exports = SequelizeCustomerRepository;
