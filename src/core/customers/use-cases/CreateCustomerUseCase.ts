import ResourceAlreadyExistsError from "../../common/exceptions/ResourceAlreadyExistsError";
import CustomerGateway from "../../interfaces/CustomerGateway";
import CustomerDTO from "../dto/CustomerDTO";
import CreateCustomer from "../interfaces/CreateCustomer";
import { CustomerMapper } from "../mappers/CustomerMapper";

export default class CreateCustomerUseCase implements CreateCustomer {
  constructor(private customerGateway: CustomerGateway) {}

  async create(customerDTO: CustomerDTO) {
    const customer = CustomerMapper.toCustomerEntity(customerDTO);
    const cpf = customer.getCpf();
    await this.validateCustomerExistence(cpf);
    return await this.customerGateway.create(CustomerMapper.toCustomerDTO(customer));
  }

  private async validateCustomerExistence(cpf: string) {
    const validateCustomerExistence = await this.customerGateway.findByCPF(cpf);

    if (validateCustomerExistence) {
      throw new ResourceAlreadyExistsError(ResourceAlreadyExistsError.Resources.Customer, "cpf", cpf);
    }
  }
}
