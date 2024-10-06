import Customer from "../entities/Customer";
import CustomerDTO from "../dto/CustomerDTO";

import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import ResourceAlreadyExistsError from "../../common/exceptions/ResourceAlreadyExistsError";
import InvalidAttributeError from "../../common/exceptions/InvalidAttributeError";
import MissingPropertyError from "../../common/exceptions/MissingPropertyError";
import CustomerRepository from "../../ports/CustomerRepository";
import CustomerManagementPort from "../../ports/CustomerManagement";
import CPFValidator from "../../ports/CPFValidator";
import EmailValidator from "../../ports/EmailValidator";

export default class CustomerManagement implements CustomerManagementPort {
  constructor(
    private customerRepository: CustomerRepository,
    private cpfValidator: CPFValidator,
    private emailValidator: EmailValidator
  ) {}

  async create(customerDTO: CustomerDTO) {
    const customer = this.#toCustomerEntity(customerDTO);
    const cpf = customer.getCpf();
    const email = customer.getEmail();
    this.validateCustomerData(cpf, email);
    await this.validateCustomerExistence(cpf);
    return await this.customerRepository.create(this.#toCustomerDTO(customer));
  }

  async findByCPF(cpf: string) {
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

  async validateCustomerExistence(cpf: string) {
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

  validateCustomerData(cpf: string, email: string) {
    this.assertCPFValidity(cpf);
    this.assertEmailValidity(email);
  }

  assertCPFValidity(cpf: string) {
    if (!this.cpfValidator.isValid(cpf)) {
      throw new InvalidAttributeError("cpf", cpf);
    }
  }

  assertEmailValidity(email: string) {
    if (!this.emailValidator.isValid(email)) {
      throw new InvalidAttributeError("email", email);
    }
  }

  #toCustomerDTO(customerEntity: Customer) {
    return new CustomerDTO({
      id: customerEntity.getId(),
      name: customerEntity.getName(),
      cpf: customerEntity.getCpf(),
      email: customerEntity.getEmail()
    });
  }

  #toCustomerEntity(customerDTO: CustomerDTO) {
    return new Customer({
      id: customerDTO.id!,
      name: customerDTO.name!,
      cpf: customerDTO.cpf!,
      email: customerDTO.email!
    });
  }
}
