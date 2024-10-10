import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";

import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";
import OrderDTO from "../../../../core/orders/dto/OrderDTO";
import CreateCustomerUseCase from "../../../../core/customers/use-cases/CreateCustomerUseCase";
import GetOrderUseCase from "../../../../core/orders/use-cases/GetOrderUseCase";
import CreateOrderUseCase from "../../../../core/orders/use-cases/CreateOrderUseCase";

import OrderGateway from "../../../../core/gateways/OrderGateways";
import FakeOrderGateway from "../../../../gateways/FakeOrderGateway";
import FakeCustomerGateway from "../../../../gateways/FakeCustomerGateway";
import CustomerGateway from "../../../../core/gateways/CustomerGateway";

import CPFValidator from "../../../../core/ports/CPFValidator";
import EmailValidator from "../../../../core/ports/EmailValidator";

chai.use(chaiAsPromised);

class FakeCPFValidator implements CPFValidator {
  public isValidCpf: boolean = true;
  isValid(cpf: string): boolean {
    return this.isValidCpf;
  }
}

class FakeEmailValidator implements EmailValidator {
  public isValidEmail: boolean = true;
  isValid(email: string): boolean {
    return this.isValidEmail;
  }
}

const CUSTOMER_DTO = new CustomerDTO({
  name: "John Doe",
  cpf: "11111111111",
  email: "john.doe@gmail.com"
});

let orderGateway: OrderGateway;
let customerGateway: CustomerGateway;

context("Order Use Case", () => {
  beforeEach(() => {
    customerGateway = new FakeCustomerGateway();
    orderGateway = new FakeOrderGateway();
  });

  function setupCreateOrderUseCase() {
    return new CreateOrderUseCase(orderGateway, customerGateway);
  }

  function setupGetOrderUseCase() {
    return new GetOrderUseCase(orderGateway);
  }

  async function createCustomer() {
    const cpfValidatorMock = new FakeCPFValidator();
    const emailValidatorMock = new FakeEmailValidator();
    const customeUseCase = new CreateCustomerUseCase(customerGateway, cpfValidatorMock, emailValidatorMock);
    return await customeUseCase.create(CUSTOMER_DTO);
  }

  async function createOrderDTO() {
    const customer = await createCustomer();
    return new OrderDTO({ customerId: customer!.id });
  }

  describe("Get order by id", () => {
    it("should return requested order", async () => {
      const orderDTO = await createOrderDTO();
      const createOrderUseCase = setupCreateOrderUseCase();
      const getOrderUseCase = setupGetOrderUseCase();
      const order = await createOrderUseCase.createOrder(orderDTO);
      const requestedOrder = await getOrderUseCase.getOrder(order.id!);

      expect(requestedOrder).to.not.be.undefined;
      expect(requestedOrder.id).to.be.equals(order.id);
      expect(requestedOrder.status).to.be.equals(order.status);
      expect(requestedOrder.code).to.be.equals(order.code);
    });

    it("should throw error when order does not exist", async () => {
      const unexistingOrderId = -1;
      const getOrderUseCase = setupGetOrderUseCase();
      await expect(getOrderUseCase.getOrder(unexistingOrderId)).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });
  });
});
