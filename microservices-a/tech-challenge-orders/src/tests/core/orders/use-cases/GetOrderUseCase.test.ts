import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";

import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";
import OrderDTO from "../../../../core/orders/dto/OrderDTO";
import GetOrderUseCase from "../../../../core/orders/use-cases/GetOrderUseCase";
import CreateOrderUseCase from "../../../../core/orders/use-cases/CreateOrderUseCase";

import OrderGateway from "../../../../core/interfaces/OrderGateway";
import FakeOrderGateway from "../../../../gateways/FakeOrderGateway";
import FakeCustomerGateway from "../../../../gateways/FakeCustomerGateway";
import CustomerGateway from "../../../../core/interfaces/CustomerGateway";

chai.use(chaiAsPromised);

const CUSTOMER_DTO = new CustomerDTO({
  name: "John Doe",
  cpf: "11111111111",
  email: "john.doe@gmail.com",
});

let orderGateway: OrderGateway, customerGateway: FakeCustomerGateway;

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
    return customerGateway.create(CUSTOMER_DTO);
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
      expect(requestedOrder?.id).to.be.equals(order.id);
      expect(requestedOrder?.status).to.be.equals(order.status);
      expect(requestedOrder?.code).to.be.equals(order.code);
    });

    it("should throw error when order does not exist", async () => {
      const unexistingOrderId = -1;
      const getOrderUseCase = setupGetOrderUseCase();
      await expect(
        getOrderUseCase.getOrder(unexistingOrderId)
      ).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });
  });
});
