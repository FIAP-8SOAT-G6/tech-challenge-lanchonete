import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";
import OrderDTO from "../../../../core/orders/dto/OrderDTO";

import OrderPaymentsStatus from "../../../../core/orders/entities/OrderPaymentsStatus";

import CustomerGateway from "../../../../core/interfaces/CustomerGateway";
import OrderGateway from "../../../../core/interfaces/OrderGateway";
import FakeCustomerGateway from "../../../../gateways/FakeCustomerGateway";
import FakeOrderGateway from "../../../../gateways/FakeOrderGateway";

import CreateOrderUseCase from "../../../../core/orders/use-cases/CreateOrderUseCase";
import CreateCustomerUseCase from "../../../../core/customers/use-cases/CreateCustomerUseCase";
import GetPaymentStatusUseCase from "../../../../core/orders/use-cases/GetPaymentStatusUseCase";

chai.use(chaiAsPromised);

const CUSTOMER_DTO = new CustomerDTO({
  name: "John Doe",
  cpf: "11111111111",
  email: "john.doe@gmail.com"
});

let customerGateway: CustomerGateway;
let orderGateway: OrderGateway;

describe("Order payment status", () => {
  beforeEach(() => {
    customerGateway = new FakeCustomerGateway();
    orderGateway = new FakeOrderGateway();
  });

  function setupCreateOrderUseCase() {
    return new CreateOrderUseCase(orderGateway, customerGateway);
  }

  function setupGetPaymentStatusUseCase() {
    return new GetPaymentStatusUseCase(orderGateway);
  }

  async function createCustomer() {
    const customerUseCase = new CreateCustomerUseCase(customerGateway);
    return await customerUseCase.create(CUSTOMER_DTO);
  }

  async function createOrderDTO() {
    const customer = await createCustomer();
    return new OrderDTO({ customerId: customer!.id });
  }
  it('should return "PENDING" while the order awaits payment', async () => {
    const createOrderUseCase = setupCreateOrderUseCase();
    const getPaymentStatus = setupGetPaymentStatusUseCase();

    const orderDTO = await createOrderDTO();
    const order = await createOrderUseCase.createOrder(orderDTO);

    const paymentStatus = await getPaymentStatus.getPaymentStatus(order.id!);
    expect(paymentStatus).to.be.equals(OrderPaymentsStatus.PENDING);
  });
});
