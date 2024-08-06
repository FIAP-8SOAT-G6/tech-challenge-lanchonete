const MissingPropertyError = require("../exceptions/MissingPropertyError");

class Customer {
  constructor({ id, name, cpf, email }) {
    this.id = id;

    this.setName(name);
    this.setCPF(cpf);
    this.setEmail(email);
  }

  setName(name) {
    this.#validateName(name);
    this.name = name;
  }

  setCPF(cpf) {
    this.#validateCPF(cpf);
    this.cpf = cpf;
  }

  setEmail(email) {
    this.#validateEmail(email);
    this.email = email;
  }

  #validateName(name) {
    if (!name) {
      throw new MissingPropertyError({ property: "name" });
    }
  }

  #validateCPF(cpf) {
    if (!cpf) {
      throw new MissingPropertyError({ property: "cpf" });
    }
  }

  #validateEmail(email) {
    if (!email) {
      throw new MissingPropertyError({ property: "email" });
    }
  }
}

module.exports = Customer;