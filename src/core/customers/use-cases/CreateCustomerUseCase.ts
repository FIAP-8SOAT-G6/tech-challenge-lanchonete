import ResourceAlreadyExistsError from "../../common/exceptions/ResourceAlreadyExistsError";
import CustomerGateway from "../../interfaces/CustomerGateway";
import CustomerDTO from "../dto/CustomerDTO";
import Customer from "../entities/Customer";
import CreateCustomer from "../interfaces/CreateCustomer";

export default class CreateCustomerUseCase implements CreateCustomer {
  constructor(private customerGateway: CustomerGateway) {}

  async create(customerDTO: CustomerDTO) {
    const customer = this.#toCustomerEntity(customerDTO);
    const cpf = customer.getCpf();
    await this.validateCustomerExistence(cpf);
    return await this.customerGateway.create(this.#toCustomerDTO(customer));
  }

  private async validateCustomerExistence(cpf: string) {
    const validateCustomerExistence = await this.customerGateway.findByCPF(cpf);

    if (validateCustomerExistence) {
      throw new ResourceAlreadyExistsError(ResourceAlreadyExistsError.Resources.Customer, "cpf", cpf);
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
