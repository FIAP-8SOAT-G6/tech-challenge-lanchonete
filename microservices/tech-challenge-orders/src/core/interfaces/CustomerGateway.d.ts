export default interface CustomerGateway {
  findById(id: number): Promise<CustomerDTO | undefined>;
}
