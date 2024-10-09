import CustomerDTO from "../core/customers/dto/CustomerDTO";

export default class CustomerPresenter {
  public static adaptCustomerData(customer: CustomerDTO | null): string {
    if (!customer) return JSON.stringify({});
    return JSON.stringify({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      cpf: customer.cpf
    });
  }

  public static adaptCustomersData(customers: CustomerDTO[] | null): string {
    if (!customers) return JSON.stringify({});
    return JSON.stringify(
      customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        cpf: customer.cpf
      }))
    );
  }
}
