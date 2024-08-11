class CustomerDTO {
  constructor({ id, name, cpf, email }) {
    this.id = id;
    this.name = name;
    this.cpf = cpf;
    this.email = email;
  }
}

module.exports = CustomerDTO;
