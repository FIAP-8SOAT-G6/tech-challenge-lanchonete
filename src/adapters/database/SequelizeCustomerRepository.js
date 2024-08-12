const CustomerDTO = require("../../core/customers/dto/CustomerDTO");
const { sequelize } = require("../../infrastructure/database/models");

const { Customer: SequelizeCustomer } = sequelize.models;

class SequelizeCustomerRepository {
  async create(customerDTO) {
    const { name, cpf, email } = customerDTO;
    const newCustomer = await SequelizeCustomer.create({
      name,
      cpf,
      email
    });
    return this.#createCustomerDTO(newCustomer);
  }

  async findByCPF(cpf) {
    const customer = await SequelizeCustomer.findOne({
      where: { cpf: cpf }
    });
    return this.#createCustomerDTO(customer);
  }

  async findById(id) {
    const customer = await SequelizeCustomer.findByPk(id);
    return this.#createCustomerDTO(customer);
  }

  #createCustomerDTO(dbCustomer) {
    if (!dbCustomer) return undefined;

    const { id, name, cpf, email } = dbCustomer;
    return new CustomerDTO({ id, name, cpf, email });
  }
}

module.exports = SequelizeCustomerRepository;
