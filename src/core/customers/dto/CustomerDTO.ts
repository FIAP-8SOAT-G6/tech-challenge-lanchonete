export default class CustomerDTO {
  public id?: number;
  public name?: string;
  public cpf?: string;
  public email?: string;

  constructor({
    id,
    name,
    cpf,
    email
  }: {
    id?: number;
    name?: string;
    cpf?: string;
    email?: string;
  }) {
    this.id = id;
    this.name = name;
    this.cpf = cpf;
    this.email = email;
  }
}

module.exports = CustomerDTO;
