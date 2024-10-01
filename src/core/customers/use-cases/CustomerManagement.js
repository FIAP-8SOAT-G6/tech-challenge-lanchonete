const Customer = require("../entities/Customer");
const CustomerDTO = require("../dto/CustomerDTO");

const ResourceNotFoundError = require("../../common/exceptions/ResourceNotFoundError");
const ResourceAlreadyExistsError = require("../../common/exceptions/ResourceAlreadyExistsError");
const MissingPropertyError = require("../../common/exceptions/MissingPropertyError");
const InvalidAttributeError = require("../../common/exceptions/InvalidAttributeError");

class CustomerManagement {
  constructor(customerRepository, cpfValidator, emailValidator) {
    this.customerRepository = customerRepository;
    this.cpfValidator = cpfValidator;
    this.emailValidator = emailValidator;
  }

  async create(customerDTO) {
    const customer = this.#toCustomerEntity(customerDTO);
    const cpf = customer.getCpf();
    const email = customer.getEmail();
    await this.validateCustomerData(cpf, email);
    await this.validateCustomerExistence(cpf);
    return await this.customerRepository.create(this.#toCustomerDTO(customer));
  }

  async findByCPF(cpf) {
    if (!cpf) throw new MissingPropertyError("cpf");

    const customer = await this.customerRepository.findByCPF(cpf);
    if (!customer)
      throw new ResourceNotFoundError(
        ResourceNotFoundError.Resources.Customer,
        "cpf",
        cpf
      );

    return customer;
  }

  async validateCustomerExistence(cpf) {
    const validateCustomerExistence = await this.customerRepository.findByCPF(
      cpf
    );

    if (validateCustomerExistence) {
      throw new ResourceAlreadyExistsError(
        ResourceAlreadyExistsError.Resources.Customer,
        "cpf",
        cpf
      );
    }
  }

  async validateCustomerData(cpf, email) {
    await this.assertCPFValidity(cpf);
    await this.assertEmailValidity(email);
  }

  async assertCPFValidity(cpf) {
    console.log("erro cpf");
    if (!this.cpfValidator.isValid(cpf)) {
      throw new InvalidAttributeError("cpf", cpf);
    }
  }

  async assertEmailValidity(email) {
    if (!this.emailValidator.isValid(email)) {
      throw new InvalidAttributeError("email", email);
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
