import MissingPropertyError from "../../../../core/common/exceptions/MissingPropertyError";
import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";
import FindCustomerByCpfUseCase from "../../../../core/customers/use-cases/FindCustomerByCpfUseCase";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";
import FakeCustomerGateway from "../../../../gateways/FakeCustomerGateway";
import CustomerGateway from "../../../../core/interfaces/CustomerGateway";

chai.use(chaiAsPromised);
const expect = chai.expect;

let customerGateway: CustomerGateway;
context("Customer Management", () => {
  function setupUseCase() {
    customerGateway = new FakeCustomerGateway();

    return new FindCustomerByCpfUseCase(customerGateway);
  }

  describe("find by CPF", () => {
    it("should find customer by CPF", async () => {
      const customerDTO = new CustomerDTO({
        name: "Ana",
        cpf: "123.456.789-01",
        email: "test@mail.com"
      });

      const customerManagementUseCase = setupUseCase();
      await customerGateway.create(customerDTO);

      const customerFound = await customerManagementUseCase.findByCPF(customerDTO.cpf!);

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

      await expect(customerManagementUseCase.findByCPF("123")).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });
  });
});
