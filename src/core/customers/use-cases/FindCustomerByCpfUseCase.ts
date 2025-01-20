import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import CustomerGateway from "../../interfaces/CustomerGateway";
import FindCustomerByCpf from "../interfaces/FindCustomerByCpf";

export default class FindCustomerByCpfUseCase implements FindCustomerByCpf {
  constructor(private customerGateway: CustomerGateway) {}

  async findByCPF(cpf: string) {
    const customer = await this.customerGateway.findByCPF(cpf);
    if (!customer) throw new ResourceNotFoundError(ResourceNotFoundError.Resources.Customer, "cpf", cpf);

    return customer;
  }
}
