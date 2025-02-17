import FakeCustomerGateway from "../../../../gateways/FakeCustomerGateway";
import ResourceAlreadyExistsError from "../../../../core/common/exceptions/ResourceAlreadyExistsError";
import CreateCustomerUseCase from "../../../../core/customers/use-cases/CreateCustomerUseCase";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";

import InvalidAttributeError from "../../../../core/common/exceptions/InvalidAttributeError";

chai.use(chaiAsPromised);
const expect = chai.expect;

context("Create Customer Use Case", () => {
  function setupUseCase() {
    const repository = new FakeCustomerGateway();

    return new CreateCustomerUseCase(repository);
  }

  describe("create", () => {
    it("should create a Customer with an id", async () => {
      const customerDTO = new CustomerDTO({
        name: "Ana",
        cpf: "123.456.789-09",
        email: "test@mail.com"
      });

      const customerManagementUseCase = setupUseCase();
      const customerCreated = await customerManagementUseCase.create(customerDTO);

      expect(customerCreated).to.not.be.undefined;
      expect(customerCreated!.id).to.be.equal(1);
    });

    it("should display an error message when an existing CPF is provided", async () => {
      const customerDTO = new CustomerDTO({
        name: "Ana",
        cpf: "123.456.789-09",
        email: "test@mail.com"
      });

      const customerManagementUseCase = setupUseCase();
      await customerManagementUseCase.create(customerDTO);

      await expect(customerManagementUseCase.create(customerDTO)).to.be.eventually.rejectedWith(ResourceAlreadyExistsError);
    });

    it("should throw an error when cpf is invalid", async () => {
      const customerDTO = new CustomerDTO({
        name: "Ana",
        cpf: "123.456.789-10",
        email: "test@mail.com"
      });
      const customerManagementUseCase = setupUseCase();
      await expect(customerManagementUseCase.create(customerDTO)).to.be.eventually.rejectedWith(InvalidAttributeError);
    });

    it("should throw an error when email is invalid", async () => {
      const customerDTO = new CustomerDTO({
        name: "Ana",
        cpf: "123.456.789-09",
        email: "ana.com"
      });
      const customerManagementUseCase = setupUseCase();
      await expect(customerManagementUseCase.create(customerDTO)).to.be.eventually.rejectedWith(InvalidAttributeError);
    });
  });
});
