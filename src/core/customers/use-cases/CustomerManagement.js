const Customer = require("../entities/Customer");
const NonexistentCustomerError = require("../exceptions/NonexistentCustomerError");
const ExistentCustomerError = require("../exceptions/ExistentCustomerError");
const MissingPropertyError = require("../../common/exceptions/MissingPropertyError");
const CustomerDTO = require("../dto/CustomerDTO");


class CustomerManagement {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async create(customerDTO) {
    const customer = this.#toCustomerEntity(customerDTO);
    await this.validateCustomerExistence(customer.getCpf());
    return await this.customerRepository.create(this.#toCustomerDTO(customer));
  }

  async findByCPF(cpf) {
    if (!cpf) throw new MissingPropertyError("cpf");

    const customer = await this.customerRepository.findByCPF(cpf);
    if (!customer) throw new NonexistentCustomerError(cpf);

    return customer;
  }

  async validateCustomerExistence(cpf) {
    const validateCustomerExistence = await this.customerRepository.findByCPF(
      cpf
    );

    if (validateCustomerExistence) {
      throw new ExistentCustomerError(cpf);
    }
  }

  #toCustomerDTO(customerEntity) {
    return new CustomerDTO({
      id: customerEntity.getId(),
      name: customerEntity.getName(),
      cpf: customerEntity.getCpf(),
      email: customerEntity.getEmail()
    });
  }

  #toCustomerEntity(customerDTO) {
    return new Customer({
      id: customerDTO.id,
      name: customerDTO.name,
      cpf: customerDTO.cpf,
      email: customerDTO.email
    });
  }
}

module.exports = CustomerManagement;
