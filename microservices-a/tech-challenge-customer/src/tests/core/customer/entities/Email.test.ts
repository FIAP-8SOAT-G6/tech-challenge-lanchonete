import Email from "../../../../core/customers/entities/Email";
import { expect } from "chai";
import InvalidAttributeError from "../../../../core/common/exceptions/InvalidAttributeError";
import MissingPropertyError from "../../../../core/common/exceptions/MissingPropertyError";

describe("Email Validations", () => {
  it("should not throw an error when validations pass", () => {
    expect(() => new Email({ email: "test@gmail.com" })).to.not.throw();
  });

  it("should throw an error when Email is not given", () => {
    expect(() => new Email({ email: "" })).to.throw(new MissingPropertyError("email").message);
  });

  it("should throw an error when Email is invalid", () => {
    expect(() => new Email({ email: "test.com" })).to.throw(InvalidAttributeError);
  });
});
