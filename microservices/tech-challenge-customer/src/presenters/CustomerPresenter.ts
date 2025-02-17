import CustomerDTO from "../core/customers/dto/CustomerDTO";

export type CustomerResponse = {
  id: number;
  name: string;
  email: string;
  cpf: string;
};

export default class CustomerPresenter {
  public static adaptCustomerData(customer: CustomerDTO | null): CustomerResponse {
    if (!customer) return {} as CustomerResponse;
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      cpf: customer.cpf
    } as CustomerResponse;
  }

  public static adaptCustomersData(customers: CustomerDTO[] | null): CustomerResponse[] {
    if (!customers) return [];
    return customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      cpf: customer.cpf
    })) as CustomerResponse[];
  }
}
