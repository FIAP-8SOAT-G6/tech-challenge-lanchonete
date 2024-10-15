import MissingPropertyError from "../../common/exceptions/MissingPropertyError";
import CPF from "./CPF";
import Email from "./Email";

type CustomerParams = {
  id?: number;
  name: string;
  cpf: string;
  email: string;
};

export default class Customer {
  private id!: number | undefined;
  private name!: string;
  private cpf!: CPF;
  private email!: Email;

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
    return this.cpf.getCPF();
  }

  getEmail() {
    return this.email.getEmail();
  }

  setName(name: string) {
    this.validateName(name);
    this.name = name;
  }

  setCPF(cpf: string) {
    this.cpf = new CPF({ cpf });
  }

  setEmail(email: string) {
    this.email = new Email({ email });
  }

  private validateName(name: string) {
    if (!name) {
      throw new MissingPropertyError("name");
    }
  }
}
