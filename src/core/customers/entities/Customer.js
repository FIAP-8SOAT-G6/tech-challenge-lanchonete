const MissingPropertyError = require("../exceptions/MissingPropertyError");

class Customer {
  #id;
  #name;
  #cpf;
  #email;

  constructor({ id, name, cpf, email }) {
    this.#id = id;

    this.setName(name);
    this.setCPF(cpf);
    this.setEmail(email);
  }

  getId() {
    return this.#id;
  }

  getName() {
    return this.#name;
  }

  getCpf() {
    return this.#cpf;
  }

  getEmail() {
    return this.#email;
  }

  setName(name) {
    this.#validateName(name);
    this.#name = name;
  }

  setCPF(cpf) {
    this.#validateCPF(cpf);
    this.#cpf = cpf;
  }

  setEmail(email) {
    this.#validateEmail(email);
    this.#email = email;
  }

  #validateName(name) {
    if (!name) {
      throw new MissingPropertyError("name");
    }
  }

  #validateCPF(cpf) {
    if (!cpf) {
      throw new MissingPropertyError("cpf");
    }
  }

  #validateEmail(email) {
    if (!email) {
      throw new MissingPropertyError("email");
    }
  }
}

module.exports = Customer;
