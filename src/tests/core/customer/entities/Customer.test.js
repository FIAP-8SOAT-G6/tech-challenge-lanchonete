const sinon = require("sinon");
const Customer = require("../../../../core/customers/entities/Customer");
const MissingPropertyError = require("../../../../core/common/exceptions/MissingPropertyError");
const CPFValidatorAdapter = require("../../../../adapters/services/validators/CPFValidatorAdapter");
const EmailValidatorAdapter = require("../../../../adapters/services/validators/EmailValidatorAdapter");
const InvalidAttributeError = require("../../../../core/common/exceptions/InvalidAttributeError");

const expect = require("chai").expect;

let cpfValidatorMock, emailValidatorMock;

context("Customer", () => {
  beforeEach(() => {
    cpfValidatorMock = sinon.createStubInstance(CPFValidatorAdapter);
    emailValidatorMock = sinon.createStubInstance(EmailValidatorAdapter);
    cpfValidatorMock.isValid.returns(true);
    emailValidatorMock.isValid.returns(true);
  });

  describe("validations", () => {
    it("should not throw an error when validations pass", () => {
      expect(
        () =>
          new Customer(
            {
              id: "123",
              name: "Ana",
              cpf: "123.456.789-00",
              email: "test@mail.com"
            },
            {
              cpfValidator: cpfValidatorMock,
              emailValidator: emailValidatorMock
            }
          )
      ).to.not.throw();
    });

    it("should throw an error when name is not provided", () => {
      expect(
        () =>
          new Customer(
            {
              id: "123",
              name: null,
              cpf: "123.456.789-00",
              email: "test@mail.com"
            },
            {
              cpfValidator: cpfValidatorMock,
              emailValidator: emailValidatorMock
            }
          )
      ).to.throw(new MissingPropertyError("name").message);
    });

    it("should throw an error when CPF is not provided", () => {
      expect(
        () =>
          new Customer(
            {
              id: "123",
              name: "Ana",
              cpf: null,
              email: "test@mail.com"
            },
            {
              cpfValidator: cpfValidatorMock,
              emailValidator: emailValidatorMock
            }
          )
      ).to.throw(new MissingPropertyError("cpf").message);
    });

    it("should throw an error when email is not provided", () => {
      expect(
        () =>
          new Customer(
            {
              id: "123",
              name: "Ana",
              cpf: "123.456.789-00",
              email: undefined
            },
            {
              cpfValidator: cpfValidatorMock,
              emailValidator: emailValidatorMock
            }
          )
      ).to.throw(new MissingPropertyError("email").message);
    });

    it("should throw an error when cpf is invalid", async () => {
      cpfValidatorMock.isValid.returns(false);
      expect(
        () =>
          new Customer(
            {
              id: "123",
              name: "Ana",
              cpf: "123.456.789-00",
              email: undefined
            },
            {
              cpfValidator: cpfValidatorMock,
              emailValidator: emailValidatorMock
            }
          )
      ).to.throw(InvalidAttributeError);
    });

    it("should throw an error when email is invalid", async () => {
      emailValidatorMock.isValid.returns(false);
      expect(
        () =>
          new Customer(
            {
              id: "123",
              name: "Ana",
              cpf: "123.456.789-00",
              email: "test@com"
            },
            {
              cpfValidator: cpfValidatorMock,
              emailValidator: emailValidatorMock
            }
          )
      ).to.throw(InvalidAttributeError);
    });
  });
});
