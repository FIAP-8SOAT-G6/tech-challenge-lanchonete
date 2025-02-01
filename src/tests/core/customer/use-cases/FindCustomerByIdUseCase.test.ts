import MissingPropertyError from "../../../../core/common/exceptions/MissingPropertyError";
import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";
import FakeCustomerGateway from "../../../../gateways/FakeCustomerGateway";
import CustomerGateway from "../../../../core/interfaces/CustomerGateway";
import FindCustomerByIdUseCase from "../../../../core/customers/use-cases/FindCustomerByIdUseCase";

chai.use(chaiAsPromised);
const expect = chai.expect;

let customerGateway: CustomerGateway;
context("Customer Management", () => {
  function setupUseCase() {
    customerGateway = new FakeCustomerGateway();

    return new FindCustomerByIdUseCase(customerGateway);
  }

  describe("find by ID", () => {
    it("should find customer by ID", async () => {
      const customerDTO = new CustomerDTO({
        name: "Ana",
        cpf: "123.456.789-01",
        email: "test@mail.com"
      });

      const customerManagementUseCase = setupUseCase();
      const { id } = await customerGateway.create(customerDTO);

      const customerFound = await customerManagementUseCase.findByID(id!);

      expect(customerFound).to.not.be.undefined;
      expect(customerFound.cpf).to.be.equal(customerDTO.cpf);
    });

    it("should display an error message when it cannot find the customer", async () => {
      const customerDTO = new CustomerDTO({
        name: "Ana",
        cpf: "123.456.789-01",
        email: "test@mail.com"
      });

      const customerManagementUseCase = setupUseCase();

      await customerGateway.create(customerDTO);

      await expect(customerManagementUseCase.findByID(123)).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });
  });
});
