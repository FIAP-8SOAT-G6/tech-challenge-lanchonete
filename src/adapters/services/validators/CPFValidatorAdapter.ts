import { cpf } from "cpf-cnpj-validator";
import CPFValidator from "../../../core/ports/CPFValidator";

export default class CPFValidatorAdapter implements CPFValidator {
  isValid(value: string): boolean {
    return cpf.isValid(value);
  }
}
