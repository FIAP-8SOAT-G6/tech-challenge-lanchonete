import CustomerDTO from "../core/customers/dto/CustomerDTO";

export interface CustomersSource {
  findByCPF(cpf: string): Promise<CustomerDTO | undefined>;
  findByID(id: number): Promise<CustomerDTO | undefined>;
}
