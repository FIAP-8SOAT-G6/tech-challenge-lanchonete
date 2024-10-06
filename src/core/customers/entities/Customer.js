const InvalidAttributeError = require("../../common/exceptions/InvalidAttributeError");
const MissingPropertyError = require("../../common/exceptions/MissingPropertyError");

class Customer {
  #id;
  #name;
  #cpf;
  #email;
  #cpfValidator;
  #emailValidator;

  constructor({ id, name, cpf, email }, { cpfValidator, emailValidator }) {
    this.#id = id;
    this.#cpfValidator = cpfValidator;
    this.#emailValidator = emailValidator;

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
    if (!this.#cpfValidator?.isValid(cpf)) {
      throw new InvalidAttributeError("cpf", cpf);
    }
  }

  #validateEmail(email) {
    if (!email) {
      throw new MissingPropertyError("email");
    }

    if (!this.#emailValidator?.isValid(email)) {
      throw new InvalidAttributeError("email", email);
    }
  }
}

module.exports = Customer;
