import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { OrderStatus } from "../../../../core/orders/entities/OrderStatus";

import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";

import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";
import OrderDTO from "../../../../core/orders/dto/OrderDTO";

import FakeOrderGateway from "../../../../gateways/FakeOrderGateway";
import FakeCustomerGateway from "../../../../gateways/FakeCustomerGateway";
import OrderGateway from "../../../../core/interfaces/OrderGateway";
import CustomerGateway from "../../../../core/interfaces/CustomerGateway";

import CreateOrderUseCase from "../../../../core/orders/use-cases/CreateOrderUseCase";
import CreateCustomerUseCase from "../../../../core/customers/use-cases/CreateCustomerUseCase";

chai.use(chaiAsPromised);

const CUSTOMER_DTO = new CustomerDTO({
  name: "John Doe",
  cpf: "11111111111",
  email: "john.doe@gmail.com"
});

let customerGateway: CustomerGateway;
let orderGateway: OrderGateway;

context("Order Use Case", () => {
  beforeEach(() => {
    customerGateway = new FakeCustomerGateway();
    orderGateway = new FakeOrderGateway();
  });

  function setupUseCase() {
    return new CreateOrderUseCase(orderGateway, customerGateway);
  }

  async function createCustomer() {
    const customeUseCase = new CreateCustomerUseCase(customerGateway);
    return await customeUseCase.create(CUSTOMER_DTO);
  }

  async function createOrderDTO() {
    const customer = await createCustomer();
    return new OrderDTO({ customerId: customer!.id });
  }

  describe("Create order", () => {
    it("should create order with status 'CREATED'", async () => {
      const orderDTO = await createOrderDTO();
      const createOrderUseCase = setupUseCase();
      const createdOrder = await createOrderUseCase.createOrder(orderDTO);
      expect(createdOrder).to.not.be.undefined;
      expect(createdOrder.id).to.not.be.undefined;
      expect(createdOrder.status).to.be.equals(OrderStatus.CREATED);
      expect(createdOrder.code).to.not.be.undefined;
      expect(createdOrder.elapsedTime).to.not.be.undefined;
    });

    it("should not throw an error when creating order with anonymous customer", async () => {
      const anonymousCustomerId = null;
      const orderDTO = new OrderDTO({ customerId: anonymousCustomerId });
      const createOrderUseCase = setupUseCase();
      const createOrderPromise = createOrderUseCase.createOrder(orderDTO);
      await expect(createOrderPromise).to.not.be.eventually.rejectedWith(ResourceNotFoundError);
      const createdOrder = await createOrderPromise;
      expect(createdOrder).to.not.be.undefined;
      expect(createdOrder.customerId).to.be.null;
    });

    it("should throw an error when creating order with unexisting customer", async () => {
      const unexistingCustomerId = -1;
      const createOrderUseCase = setupUseCase();
      const orderDTO = new OrderDTO({ customerId: unexistingCustomerId });
      await expect(createOrderUseCase.createOrder(orderDTO)).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });
  });
});
