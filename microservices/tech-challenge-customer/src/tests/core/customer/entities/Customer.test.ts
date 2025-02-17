import Customer from "../../../../core/customers/entities/Customer";
import MissingPropertyError from "../../../../core/common/exceptions/MissingPropertyError";

import { expect } from "chai";

context("Customer", () => {
  describe("validations", () => {
    it("should not throw an error when validations pass", () => {
      expect(
        () =>
          new Customer({
            id: 123,
            name: "Ana",
            cpf: "123.456.789-09",
            email: "test@mail.com"
          })
      ).to.not.throw();
    });

    it("should throw an error when name is not provided", () => {
      expect(
        () =>
          new Customer({
            id: 123,
            name: undefined as unknown as string,
            cpf: "123.456.789-09",
            email: "test@mail.com"
          })
      ).to.throw(new MissingPropertyError("name").message);
    });

    it("should throw an error when CPF is not provided", () => {
      expect(
        () =>
          new Customer({
            id: 123,
            name: "Ana",
            cpf: undefined as unknown as string,
            email: "test@mail.com"
          })
      ).to.throw(new MissingPropertyError("cpf").message);
    });

    it("should throw an error when email is not provided", () => {
      expect(
        () =>
          new Customer({
            id: 123,
            name: "Ana",
            cpf: "123.456.789-09",
            email: undefined as unknown as string
          })
      ).to.throw(new MissingPropertyError("email").message);
    });
  });
});
