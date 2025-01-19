import CustomerDTO from "../dto/CustomerDTO";
import Customer from "../entities/Customer";

export default class CustomerMapper {
  static toCustomerDTO(customerEntity: Customer) {
    return new CustomerDTO({
      id: customerEntity.getId(),
      name: customerEntity.getName(),
      cpf: customerEntity.getCpf(),
      email: customerEntity.getEmail()
    });
  }

  static toCustomerEntity(customerDTO: CustomerDTO) {
    return new Customer({
      id: customerDTO.id!,
      name: customerDTO.name!,
      cpf: customerDTO.cpf!,
      email: customerDTO.email!
    });
  }
}
