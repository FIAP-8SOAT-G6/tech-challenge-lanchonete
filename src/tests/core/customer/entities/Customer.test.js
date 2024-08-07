const Customer = require("../../../../core/customers/entities/Customer");
const MissingPropertyError = require("../../../../core/customers/exceptions/MissingPropertyError");

const expect = require("chai").expect;

context("Customer", () => {
  describe("validations", () => {
    it("should not throw an error when validations pass", () => {
      expect(
        () =>
          new Customer({
            id: "123",
            name: "Ana",
            cpf: "123.456.789-00",
            email: "test@mail.com"
          })
      ).to.not.throw();
    });

    it("should throw an error when name is not provided", () => {
      expect(
        () =>
          new Customer({
            id: "123",
            name: null,
            cpf: "123.456.789-00",
            email: "test@mail.com"
          })
      ).to.throw(new MissingPropertyError("name").message);
    });

    it("should throw an error when CPF is not provided", () => {
      expect(
        () =>
          new Customer({
            id: "123",
            name: "Ana",
            cpf: null,
            email: "test@mail.com"
          })
      ).to.throw(new MissingPropertyError("cpf").message);
    });

    it("should throw an error when email is not provided", () => {
      expect(
        () =>
          new Customer({
            id: "123",
            name: "Ana",
            cpf: "123.456.789-00",
            email: undefined
          })
      ).to.throw(new MissingPropertyError("email").message);
    });
  });
});
