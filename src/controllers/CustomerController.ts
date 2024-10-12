import CPFValidatorAdapter from "../adapters/services/validators/CPFValidatorAdapter";
import EmailValidatorAdapter from "../adapters/services/validators/EmailValidatorAdapter";
import CustomerDTO from "../core/customers/dto/CustomerDTO";
import { CustomersFactory } from "../factories/CustomersFactory";
import { CustomerDataSource } from "../interfaces/DataSources";
import CustomerPresenter, { CustomerResponse } from "../presenters/CustomerPresenter";

export default class CustomerController {
  public static async createCustomer(customerDataSource: CustomerDataSource, customer: CustomerDTO): Promise<CustomerResponse> {
    const useCase = CustomersFactory.makeCreateCustomer(customerDataSource, new CPFValidatorAdapter(), new EmailValidatorAdapter());
    const createdCustomer = await useCase.create(customer);
    return CustomerPresenter.adaptCustomerData(createdCustomer);
  }

  public static async findCustomerByCpf(customerDataSource: CustomerDataSource, cpf: string): Promise<CustomerResponse> {
    const useCase = CustomersFactory.makeFindCustomerByCpf(customerDataSource);
    const foundCustomer = await useCase.findByCPF(cpf);
    return CustomerPresenter.adaptCustomerData(foundCustomer);
  }
}
