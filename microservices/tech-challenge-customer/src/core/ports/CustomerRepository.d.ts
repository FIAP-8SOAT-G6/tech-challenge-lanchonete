import CustomerDTO from "../../core/customers/dto/CustomerDTO";

export default interface CustomerRepository {
  create(customerDTO: CustomerDTO): Promise<CustomerDTO | undefined>;
  findByCPF(cpf: string): Promise<CustomerDTO | undefined>;
  findById(id: number): Promise<CustomerDTO | undefined>;
}
