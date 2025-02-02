import CustomerDTO from "../dto/CustomerDTO";

export default interface FindCustomerById {
  findByID(id: number): Promise<CustomerDTO>;
}
