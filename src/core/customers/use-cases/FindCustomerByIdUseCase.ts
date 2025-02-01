import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import CustomerGateway from "../../interfaces/CustomerGateway";
import FindCustomerById from "../interfaces/FindCustomerById";

export default class FindCustomerByIdUseCase implements FindCustomerById {
  constructor(private customerGateway: CustomerGateway) {}

  async findByID(id: number) {
    const customer = await this.customerGateway.findById(id);
    if (!customer) throw new ResourceNotFoundError(ResourceNotFoundError.Resources.Customer, "id", id);

    return customer;
  }
}
