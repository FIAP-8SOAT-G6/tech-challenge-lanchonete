import Customer from "../entities/Customer";
import CustomerDTO from "../dto/CustomerDTO";

import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import ResourceAlreadyExistsError from "../../common/exceptions/ResourceAlreadyExistsError";
import MissingPropertyError from "../../common/exceptions/MissingPropertyError";
import CustomerRepository from "../../ports/CustomerRepository";

export default class CustomerManagement {
  constructor(private customerRepository: CustomerRepository) {}

  async create(customerDTO: CustomerDTO) {
    const customer = this.#toCustomerEntity(customerDTO);
    await this.validateCustomerExistence(customer.getCpf());
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

module.exports = CustomerManagement;
