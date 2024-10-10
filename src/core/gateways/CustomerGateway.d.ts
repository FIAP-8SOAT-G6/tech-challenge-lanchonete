export default interface CustomerGateway {
  create(customerDTO: CustomerDTO): Promise<CustomerDTO | undefined>;
  findByCPF(cpf: string): Promise<CustomerDTO | undefined>;
  findById(id: number): Promise<CustomerDTO | undefined>;
}
