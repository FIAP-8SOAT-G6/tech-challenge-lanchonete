import CustomerDTO from "../dto/CustomerDTO";

export default interface FindCustomerByCpf {
  findByCPF(cpf: string): Promise<CustomerDTO>;
}
