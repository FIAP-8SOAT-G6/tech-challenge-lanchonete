import CreateCustomer from "../core/customers/interfaces/CreateCustomer";
import FindCustomerByCpf from "../core/customers/interfaces/FindCustomerByCpf";
import CreateCustomerUseCase from "../core/customers/use-cases/CreateCustomerUseCase";
import FindCustomerByCpfUseCase from "../core/customers/use-cases/FindCustomerByCpfUseCase";

import CustomerGateway from "../gateways/CustomerGateway";
import { CustomerDataSource } from "../interfaces/DataSources";

export class CustomersFactory {
  public static makeCreateCustomer(dataSource: CustomerDataSource): CreateCustomer {
    return new CreateCustomerUseCase(new CustomerGateway(dataSource));
  }

  public static makeFindCustomerByCpf(dataSource: CustomerDataSource): FindCustomerByCpf {
    return new FindCustomerByCpfUseCase(new CustomerGateway(dataSource));
  }
}
