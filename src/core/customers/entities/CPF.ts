import InvalidAttributeError from "../../common/exceptions/InvalidAttributeError";
import MissingPropertyError from "../../common/exceptions/MissingPropertyError";

type CPFParams = {
  cpf: string;
};

export default class CPF {
  private cpf!: string;

  constructor({ cpf }: CPFParams) {
    this.setCPF(cpf);
  }

  getCPF(): string {
    return this.cpf;
  }

  setCPF(cpf: string) {
    this.validateCPF(cpf);
    this.cpf = cpf;
  }

  private validateCPF(cpf: string) {
    if (!cpf) {
      throw new MissingPropertyError("cpf");
    }

    if (!this.isValidCPF(cpf)) {
      throw new InvalidAttributeError("cpf", cpf);
    }
  }

  private isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11) return false;

    const isValid = this.validateDigits(cpf);
    return isValid;
  }

  private validateDigits(cpf: string): boolean {
    const numbers = cpf.substring(0, 9);
    const digits = cpf.substring(9);
    const firstDigit = this.calculateDigit(numbers, 10);
    const secondDigit = this.calculateDigit(numbers + firstDigit, 11);
    return digits === `${firstDigit}${secondDigit}`;
  }

  private calculateDigit(cpfBase: string, weight: number): number {
    let total = 0;
    for (let i = 0; i < cpfBase.length; i++) {
      total += parseInt(cpfBase[i]) * weight--;
    }
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  }
}
