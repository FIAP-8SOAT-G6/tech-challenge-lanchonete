import CreateCustomer from "../core/customers/interfaces/CreateCustomer";
import FindCustomerByCpf from "../core/customers/interfaces/FindCustomerByCpf";
import CreateCustomerUseCase from "../core/customers/use-cases/CreateCustomerUseCase";
import FindCustomerByCpfUseCase from "../core/customers/use-cases/FindCustomerByCpfUseCase";

import CPFValidator from "../core/ports/CPFValidator";
import EmailValidator from "../core/ports/EmailValidator";
import CustomerGateway from "../gateways/CustomerGateway";
import { CustomerDataSource } from "../interfaces/DataSources";

export class CustomersFactory {
  public static makeCreateCustomer(dataSource: CustomerDataSource, cpfValidator: CPFValidator, emailValidator: EmailValidator): CreateCustomer {
    return new CreateCustomerUseCase(new CustomerGateway(dataSource), cpfValidator, emailValidator);
  }

  public static makeFindCustomerByCpf(dataSource: CustomerDataSource): FindCustomerByCpf {
    return new FindCustomerByCpfUseCase(new CustomerGateway(dataSource));
  }
}
