const Customer = require("../../core/customers/entities/Customer");
const { sequelize } = require("../../infrastructure/database/models");

const { Customer: SequelizeCustomer } = sequelize.models;

class SequelizeCustomerRepository {
  async create(customer) {
    const { name, cpf, email } = customer;
    const newCustomer = await SequelizeCustomer.create({
      name,
      cpf,
      email
    });

    return this.#instantiateCustomer(newCustomer);
  }

  async findByCPF(cpf) {
    const customers = await SequelizeCustomer.findOne({
      where: { cpf: cpf }
    });
    return this.#instantiateCustomer(customers);
  }

  async findById(id) {
    const customer = await SequelizeCustomer.findByPk(id);
    let { name, cpf, email } = customer;
    return this.#instantiateCustomer({ id, name, cpf, email });
  }

  #instantiateCustomer(dbCustomer) {
    if (!dbCustomer) return undefined;

    const { id, name, cpf, email } = dbCustomer;
    return new Customer({ id, name, cpf, email });
  }
}

module.exports = SequelizeCustomerRepository;
