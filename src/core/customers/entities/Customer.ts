import MissingPropertyError from "../../common/exceptions/MissingPropertyError";

type CustomerParams = {
  id?: number;
  name: string;
  cpf: string;
  email: string;
}

export default class Customer {
  private id!: number | undefined;
  private name!: string;
  private cpf!: string;
  private email!: string;

  constructor({ id, name, cpf, email }: CustomerParams) {
    this.id = id;

    this.setName(name);
    this.setCPF(cpf);
    this.setEmail(email);
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getCpf() {
    return this.cpf;
  }

  getEmail() {
    return this.email;
  }

  setName(name: string) {
    this.validateName(name);
    this.name = name;
  }

  setCPF(cpf: string) {
    this.validateCPF(cpf);
    this.cpf = cpf;
  }

  setEmail(email: string) {
    this.validateEmail(email);
    this.email = email;
  }

  private validateName(name: string) {
    if (!name) {
      throw new MissingPropertyError("name");
    }
  }

  private validateCPF(cpf: string) {
    if (!cpf) {
      throw new MissingPropertyError("cpf");
    }
  }

  private validateEmail(email: string) {
    if (!email) {
      throw new MissingPropertyError("email");
    }
  }
}


