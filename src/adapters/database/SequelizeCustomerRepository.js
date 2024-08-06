const Customer = require("../../core/customers/entities/Customer");
const { sequelize } = require("../../infrastructure/database/models");

const { Customer: SequelizeCustomer } = sequelize.models;

class SequelizeCustomerRepository {
  async create({ customer }) {
    const { name, cpf, email } = customer;
    const newCustomer = await SequelizeCustomer.create({
      name,
      cpf,
      email
    });

    return this.#instantiateCustomer(newCustomer);
  }

  async findByCPF({ cpf }) {
    const customers = await SequelizeCustomer.findAll({
      where: { cpf: cpf }
    });
    return this.#instantiateCustomer(customers[0]);
  }

  #instantiateCustomer(dbCustomer) {
    if (!dbCustomer || dbCustomer?.length === 0) return undefined;

    const { id, name, cpf, email } = dbCustomer;
    return new Customer({ id, name, cpf, email });
  }
}

module.exports = SequelizeCustomerRepository;
