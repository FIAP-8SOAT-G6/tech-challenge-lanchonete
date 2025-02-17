import InvalidAttributeError from "../../common/exceptions/InvalidAttributeError";
import MissingPropertyError from "../../common/exceptions/MissingPropertyError";

type EmailParams = {
  email: string;
};

export default class Email {
  private email!: string;

  constructor({ email }: EmailParams) {
    this.setEmail(email);
  }

  getEmail() {
    return this.email;
  }

  setEmail(email: string) {
    Email.validateEmail(email);
    this.email = email;
  }

  private static validateEmail(email: string) {
    if (!email) {
      throw new MissingPropertyError("email");
    }

    if (!Email.isValidEmail(email)) {
      throw new InvalidAttributeError("email", email);
    }
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
