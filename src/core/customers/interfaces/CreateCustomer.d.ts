import CustomerDTO from "../dto/CustomerDTO";

export default interface CreateCustomer {
  create(customerDTO: CustomerDTO): Promise<CustomerDTOO>;
}
