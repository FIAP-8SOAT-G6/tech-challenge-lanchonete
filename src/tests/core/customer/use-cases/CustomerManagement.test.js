const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const sinon = require("sinon");

const FakeCustomerRepository = require("../../../../adapters/database/FakeCustomerRepository");
const CustomerManagement = require("../../../../core/customers/use-cases/CustomerManagement");
const CustomerDTO = require("../../../../core/customers/dto/CustomerDTO");

const CpfValidatorAdapter = require("../../../../infrastructure/services/validators/CPFValidatorAdapter");
const EmailValidatorAdapter = require("../../../../infrastructure/services/validators/EmailValidatorAdapter");

const ResourceAlreadyExistsError = require("../../../../core/common/exceptions/ResourceAlreadyExistsError");
const ResourceNotFoundError = require("../../../../core/common/exceptions/ResourceNotFoundError");
const MissingPropertyError = require("../../../../core/common/exceptions/MissingPropertyError");
const InvalidAttributeError = require("../../../../core/common/exceptions/InvalidAttributeError");

chai.use(chaiAsPromised);
const expect = chai.expect;

let cpfValidatorMock, emailValidatorMock;

context("Customer Management", () => {
  function setupUseCase() {
    const repository = new FakeCustomerRepository();
    return new CustomerManagement(
      repository,
      cpfValidatorMock,
      emailValidatorMock
    );
  }

  beforeEach(() => {
    cpfValidatorMock = sinon.createStubInstance(CpfValidatorAdapter);
    emailValidatorMock = sinon.createStubInstance(EmailValidatorAdapter);
    cpfValidatorMock.isValid.returns(true);
    emailValidatorMock.isValid.returns(true);
  });

  describe("create", () => {
    it("should create a Customer with an id", async () => {
      const customerDTO = new CustomerDTO({
        name: "Ana",
        cpf: "123.456.789-00",
        email: "test@mail.com"
      });

      const customerManagementUseCase = setupUseCase();
      const customerCreated = await customerManagementUseCase.create(
        customerDTO
      );

      expect(customerCreated).to.not.be.undefined;
      expect(customerCreated.id).to.be.equal(1);
    });

    it("should display an error message when an existing CPF is provided", async () => {
      const customerDTO = new CustomerDTO({
        name: "Ana",
        cpf: "123.456.789-01",
        email: "test@mail.com"
      });

      const customerManagementUseCase = setupUseCase();
      await customerManagementUseCase.create(customerDTO);

      await expect(
        customerManagementUseCase.create(customerDTO)
      ).to.be.eventually.rejectedWith(ResourceAlreadyExistsError);
    });

    it("should throw an error when cpf is invalid", async () => {
      cpfValidatorMock.isValid.returns(false);
      const customerDTO = new CustomerDTO({
        name: "Ana",
        cpf: "1111",
        email: "test@mail.com"
      });
      const customerManagementUseCase = setupUseCase();

      await expect(
        customerManagementUseCase.create(customerDTO)
      ).to.be.eventually.rejectedWith(InvalidAttributeError);
    });

    it("should throw an error when email is invalid", async () => {
      emailValidatorMock.isValid.returns(false);
      const customerDTO = new CustomerDTO({
        name: "Ana",
        cpf: "123.456.789-00",
        email: "ana.com"
      });
      const customerManagementUseCase = setupUseCase();

      await expect(
        customerManagementUseCase.create(customerDTO)
      ).to.be.eventually.rejectedWith(InvalidAttributeError);
    });
  });

  describe("findByCPF", () => {
    it("should find customer by CPF", async () => {
      const customerDTO = new CustomerDTO({
        name: "Ana",
        cpf: "123.456.789-01",
        email: "test@mail.com"
      });

      const customerManagementUseCase = setupUseCase();
      await customerManagementUseCase.create(customerDTO);

      const customerFound = await customerManagementUseCase.findByCPF(
        customerDTO.cpf
      );

      expect(customerFound).to.not.be.undefined;
    });

    it("should display an error message when it cannot find the customer", async () => {
      const customerDTO = new CustomerDTO({
        name: "Ana",
        cpf: "123.456.789-01",
        email: "test@mail.com"
      });

      const customerManagementUseCase = setupUseCase();
      await customerManagementUseCase.create(customerDTO);

      await expect(
        customerManagementUseCase.findByCPF("123")
      ).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });

    it("should display an error message when a CPF is not provided", async () => {
      const customerDTO = new CustomerDTO({
        name: "Ana",
        cpf: "123.456.789-01",
        email: "test@mail.com"
      });

      const customerManagementUseCase = setupUseCase();
      await customerManagementUseCase.create(customerDTO);

      await expect(
        customerManagementUseCase.findByCPF("")
      ).to.be.eventually.rejectedWith(new MissingPropertyError("cpf").message);
    });
  });
});
