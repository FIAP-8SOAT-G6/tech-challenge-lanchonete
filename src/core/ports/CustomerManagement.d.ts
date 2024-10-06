import CustomerDTO from "../dto/CustomerDTO";

export default interface CustomerManagementPort {
  create(customerDTO: CustomerDTO): Promise<CustomerDTO>;

  findByCPF(cpf: string): Promise<CustomerDTO>;

  validateCustomerExistence(cpf: string): Promise<void>;
}
