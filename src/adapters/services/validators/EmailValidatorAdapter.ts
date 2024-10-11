import validator from "validator";
import EmailValidator from "../../../core/ports/EmailValidator";

export default class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return validator.isEmail(email);
  }
}
