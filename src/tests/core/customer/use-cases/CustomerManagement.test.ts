import FakeCustomerRepository from "../../../../adapters/database/FakeCustomerRepository";
import CustomerManagement from "../../../../core/customers/use-cases/CustomerManagement";
import ResourceAlreadyExistsError from "../../../../core/common/exceptions/ResourceAlreadyExistsError";
import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";
import MissingPropertyError from "../../../../core/common/exceptions/MissingPropertyError";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";

chai.use(chaiAsPromised);
const expect = chai.expect;

context("Customer Management", () => {
  function setupUseCase() {
    const repository = new FakeCustomerRepository();
    return new CustomerManagement(repository);
  }

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
      expect(customerCreated!.id).to.be.equal(1);
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
        customerDTO.cpf!
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
