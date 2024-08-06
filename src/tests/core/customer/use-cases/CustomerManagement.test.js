const FakeCustomerRepository = require("../../../../adapters/database/FakeCustomerRepository");
const CustomerManagement = require("../../../../core/customers/use-cases/CustomerManagement");
const ExistentCustomerError = require("../../../../core/customers/exceptions/ExistentCustomerError");
const NonexistentCustomerError = require("../../../../core/customers/exceptions/NonexistentCustomerError");
const MissingPropertyError = require("../../../../core/customers/exceptions/MissingPropertyError");

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

context("Customer Management", () => {
  function setupUseCase() {
    const repository = new FakeCustomerRepository();
    return new CustomerManagement(repository);
  }

  describe("create", () => {
    it("should create a Customer with an id", async () => {
      const customer = {
        name: "Ana",
        cpf: "123.456.789-00",
        email: "test@mail.com"
      };

      const customerManagementUseCase = setupUseCase();
      const customerCreated = await customerManagementUseCase.create({
        customer
      });

      expect(customerCreated).to.not.be.undefined;
      expect(customerCreated.id).to.be.equal(1);
    });

    it("should display an error message when an existing CPF is provided", async () => {
      const customer = {
        name: "Ana",
        cpf: "123.456.789-01",
        email: "test@mail.com"
      };

      const customerManagementUseCase = setupUseCase();
      await customerManagementUseCase.create({ customer });

      try {
        await customerManagementUseCase.create({ customer });
        throw new Error("Esperava uma exceção, mas nenhuma foi lançada.");
      } catch (error) {
        expect(error).to.be.instanceOf(ExistentCustomerError);
        expect(error.message).to.equal(
          new ExistentCustomerError({ cpf: customer.cpf }).message
        );
      }
    });
  });

  describe("findByCPF", () => {
    it("should find customer by CPF", async () => {
      const customer = {
        name: "Ana",
        cpf: "123.456.789-00",
        email: "test@mail.com"
      };

      const customerManagementUseCase = setupUseCase();
      await customerManagementUseCase.create({ customer });

      const customerFound = await customerManagementUseCase.findByCPF({
        cpf: customer.cpf
      });

      expect(customerFound).to.not.be.undefined;
    });

    it("should display an error message when it cannot find the customer", async () => {
      const customer = {
        name: "Ana",
        cpf: "123.456.789-00",
        email: "test@mail.com"
      };

      const customerManagementUseCase = setupUseCase();
      await customerManagementUseCase.create({ customer });

      await expect(
        customerManagementUseCase.findByCPF({ cpf: "123" })
      ).to.be.eventually.rejectedWith(
        new NonexistentCustomerError({ cpf: "123" }).message
      );
    });

    it("should display an error message when a CPF is not provided", async () => {
      const customer = {
        name: "Ana",
        cpf: "123.456.789-00",
        email: "test@mail.com"
      };

      const customerManagementUseCase = setupUseCase();
      await customerManagementUseCase.create({ customer });

      await expect(
        customerManagementUseCase.findByCPF({ cpf: "" })
      ).to.be.eventually.rejectedWith(
        new MissingPropertyError({ property: "cpf" }).message
      );
    });
  });
});
