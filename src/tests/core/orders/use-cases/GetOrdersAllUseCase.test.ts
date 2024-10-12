import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";
import OrderDTO from "../../../../core/orders/dto/OrderDTO";
import CreateCustomerUseCase from "../../../../core/customers/use-cases/CreateCustomerUseCase";
import GetOrdersAllUseCase from "../../../../core/orders/use-cases/GetOrdersAllUseCase";
import CreateOrderUseCase from "../../../../core/orders/use-cases/CreateOrderUseCase";

import OrderGateway from "../../../../core/interfaces/OrderGateway";
import FakeOrderGateway from "../../../../gateways/FakeOrderGateway";
import FakeCustomerGateway from "../../../../gateways/FakeCustomerGateway";
import CustomerGateway from "../../../../core/interfaces/CustomerGateway";

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

context("Get All Orders Use Case", () => {
  beforeEach(() => {
    customerGateway = new FakeCustomerGateway();
    orderGateway = new FakeOrderGateway();
  });

  function setupCreateOrderUseCase() {
    return new CreateOrderUseCase(orderGateway, customerGateway);
  }

  function setupGetOrdersAllUseCase() {
    return new GetOrdersAllUseCase(orderGateway);
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

  describe("get all orders", () => {
    it("should return empty object when no have orders", async () => {
      const getOrdersUseCase = setupGetOrdersAllUseCase();
      const orders = await getOrdersUseCase.getOrdersAll();
      expect(orders).to.not.be.undefined;
      expect(orders?.length).to.be.equals(0);
    });

    it("should return all orders", async () => {
      const createOrderUseCase = setupCreateOrderUseCase();
      const getOrdersAllUseCase = setupGetOrdersAllUseCase();

      const orderDTO = await createOrderDTO();
      await Promise.all([createOrderUseCase.createOrder(orderDTO), createOrderUseCase.createOrder(orderDTO)]);
      const orders = await getOrdersAllUseCase.getOrdersAll();
      expect(orders).to.not.be.undefined;
      expect(orders?.length).to.be.equals(2);
    });
  });
});
