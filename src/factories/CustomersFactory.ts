import CreateCustomer from "../core/customers/interfaces/CreateCustomer";
import FindCustomerByCpf from "../core/customers/interfaces/FindCustomerByCpf";
import FindCustomerById from "../core/customers/interfaces/FindCustomerById";
import CreateCustomerUseCase from "../core/customers/use-cases/CreateCustomerUseCase";
import FindCustomerByCpfUseCase from "../core/customers/use-cases/FindCustomerByCpfUseCase";
import FindCustomerByIdUseCase from "../core/customers/use-cases/FindCustomerByIdUseCase";

import CustomerGateway from "../gateways/CustomerGateway";
import { CustomerDataSource } from "../interfaces/DataSources";

export class CustomersFactory {
  public static makeCreateCustomer(dataSource: CustomerDataSource): CreateCustomer {
    return new CreateCustomerUseCase(new CustomerGateway(dataSource));
  }

  public static makeFindCustomerByCpf(dataSource: CustomerDataSource): FindCustomerByCpf {
    return new FindCustomerByCpfUseCase(new CustomerGateway(dataSource));
  }

  public static makeFindCustomerById(dataSource: CustomerDataSource): FindCustomerById {
    return new FindCustomerByIdUseCase(new CustomerGateway(dataSource));
  }
}
