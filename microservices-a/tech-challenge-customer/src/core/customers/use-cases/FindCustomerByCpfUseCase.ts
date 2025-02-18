import MissingParameterError from "../../common/exceptions/MissingParameterError";
import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import CustomerGateway from "../../interfaces/CustomerGateway";
import FindCustomerByCpf from "../interfaces/FindCustomerByCpf";

export default class FindCustomerByCpfUseCase implements FindCustomerByCpf {
  constructor(private readonly customerGateway: CustomerGateway) {}

  async findByCPF(cpf: string) {
    if (!cpf) throw new MissingParameterError("cpf");

    const customer = await this.customerGateway.findByCPF(cpf);
    if (!customer) throw new ResourceNotFoundError("cpf", cpf);

    return customer;
  }
}
