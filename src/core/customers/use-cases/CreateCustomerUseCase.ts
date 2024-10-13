import InvalidAttributeError from "../../common/exceptions/InvalidAttributeError";
import ResourceAlreadyExistsError from "../../common/exceptions/ResourceAlreadyExistsError";
import CustomerGateway from "../../interfaces/CustomerGateway";
import CPFValidator from "../../ports/CPFValidator";
import EmailValidator from "../../ports/EmailValidator";
import CustomerDTO from "../dto/CustomerDTO";
import Customer from "../entities/Customer";
import CreateCustomer from "../interfaces/CreateCustomer";

export default class CreateCustomerUseCase implements CreateCustomer {
  constructor(
    private customerGateway: CustomerGateway,
    private cpfValidator: CPFValidator,
    private emailValidator: EmailValidator
  ) {}

  async create(customerDTO: CustomerDTO) {
    const customer = this.#toCustomerEntity(customerDTO);
    const cpf = customer.getCpf();
    const email = customer.getEmail();
    this.validateCustomerData(cpf, email);
    await this.validateCustomerExistence(cpf);
    return await this.customerGateway.create(this.#toCustomerDTO(customer));
  }

  private async validateCustomerExistence(cpf: string) {
    const validateCustomerExistence = await this.customerGateway.findByCPF(cpf);

    if (validateCustomerExistence) {
      throw new ResourceAlreadyExistsError(ResourceAlreadyExistsError.Resources.Customer, "cpf", cpf);
    }
  }

  private validateCustomerData(cpf: string, email: string) {
    this.assertCPFValidity(cpf);
    this.assertEmailValidity(email);
  }

  private assertCPFValidity(cpf: string) {
    if (!this.cpfValidator.isValid(cpf)) {
      throw new InvalidAttributeError("cpf", cpf);
    }
  }

  private assertEmailValidity(email: string) {
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
