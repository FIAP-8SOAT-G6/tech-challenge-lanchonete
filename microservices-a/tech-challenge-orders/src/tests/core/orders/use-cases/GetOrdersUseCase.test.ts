import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { OrderStatus } from "../../../../core/orders/entities/OrderStatus";
import { OrderPaymentsStatus } from "../../../../core/orders/entities/OrderPaymentsStatus";

import ProductDTO from "../../../../core/products/dto/ProductDTO";
import ItemDTO from "../../../../core/orders/dto/ItemDTO";
import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";
import OrderDTO from "../../../../core/orders/dto/OrderDTO";

import CustomerGateway from "../../../../core/interfaces/CustomerGateway";
import OrderGateway from "../../../../core/interfaces/OrderGateway";
import ProductGateway from "../../../../core/interfaces/ProductGateway";
import FakeCustomerGateway from "../../../../gateways/FakeCustomerGateway";
import FakeOrderGateway from "../../../../gateways/FakeOrderGateway";
import FakeProductGateway from "../../../../gateways/FakeProductGateway";
import MockPaymentGateway from "../../../../gateways/MockPaymentGateway";

import CreateOrderUseCase from "../../../../core/orders/use-cases/CreateOrderUseCase";
import AddItemUseCase from "../../../../core/orders/use-cases/AddItemUseCase";
import CheckoutOrderUseCase from "../../../../core/orders/use-cases/CheckoutOrderUseCase";
import UpdateOrderStatusUseCase from "../../../../core/orders/use-cases/UpdateOrderStatusUseCase";
import ProcessOrderPaymentUseCase from "../../../../core/orders/use-cases/ProcessOrderPaymentUseCase";
import GetOrdersUseCase from "../../../../core/orders/use-cases/GetOrdersUseCase";

chai.use(chaiAsPromised);

const PRODUCT_DTO = new ProductDTO({
  name: "Hamburguer",
  category: "Lanche",
  description: "Hamburguer used for tests",
  price: 12.99,
});

const CUSTOMER_DTO = new CustomerDTO({
  name: "John Doe",
  cpf: "11111111111",
  email: "john.doe@gmail.com",
});

let customerGateway: FakeCustomerGateway,
  orderGateway: OrderGateway,
  productGateway: FakeProductGateway,
  paymentGateway: MockPaymentGateway;

describe("Get orders by priority", () => {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  beforeEach(() => {
    customerGateway = new FakeCustomerGateway();
    orderGateway = new FakeOrderGateway();
    productGateway = new FakeProductGateway();
    paymentGateway = new MockPaymentGateway();
  });

  function setupCreateOrderUseCase() {
    return new CreateOrderUseCase(orderGateway, customerGateway);
  }

  function setupCheckoutUseCase() {
    return new CheckoutOrderUseCase(orderGateway, paymentGateway);
  }

  function setupUpdateOrderStatusUseCase() {
    return new UpdateOrderStatusUseCase(orderGateway);
  }

  function createProduct() {
    return productGateway.createProduct(PRODUCT_DTO);
  }

  function setupAddItemUseCase() {
    return new AddItemUseCase(orderGateway, productGateway);
  }

  function setupGetOrdersUseCase() {
    return new GetOrdersUseCase(orderGateway);
  }

  function setupProcessOrderPaymentUseCase() {
    return new ProcessOrderPaymentUseCase(orderGateway, paymentGateway);
  }

  async function addItemToOrder(orderId: number) {
    const addItemUseCase = setupAddItemUseCase();

    const product = await createProduct();
    const itemDTO = new ItemDTO({
      productId: product.id,
      quantity: 2,
    });
    return await addItemUseCase.addItem(orderId, itemDTO);
  }

  async function createCustomer() {
    return customerGateway.create(CUSTOMER_DTO);
  }

  async function createOrderDTO() {
    const customer = await createCustomer();
    return new OrderDTO({ customerId: customer!.id });
  }

  it("should return empty object when no have orders", async () => {
    const getOrdersUseCase = setupGetOrdersUseCase();

    const orders = await getOrdersUseCase.getOrders();
    expect(orders).to.not.be.undefined;
    expect(orders.length).to.be.equals(0);
  });

  it("return orders by status priority 'DONE', in 'PREPARING' and 'RECEIVED'", async () => {
    const createOrderUseCase = setupCreateOrderUseCase();
    const checkoutUseCase = setupCheckoutUseCase();
    const updateOrderStatusUseCase = setupUpdateOrderStatusUseCase();
    const getOrdersUseCase = setupGetOrdersUseCase();
    const processOrderPaymentUseCase = setupProcessOrderPaymentUseCase();

    const { DONE, RECEIVED, PREPARING } = OrderStatus;

    const orderDTO = await createOrderDTO();
    const orderFirst = await createOrderUseCase.createOrder(orderDTO);
    const orderSecond = await createOrderUseCase.createOrder(orderDTO);
    const orderThird = await createOrderUseCase.createOrder(orderDTO);
    const orderFourth = await createOrderUseCase.createOrder(orderDTO);

    await addItemToOrder(orderFirst.id!);
    await addItemToOrder(orderSecond.id!);
    await addItemToOrder(orderThird.id!);
    await addItemToOrder(orderFourth.id!);

    await checkoutUseCase.checkout(orderFirst.id!);
    await checkoutUseCase.checkout(orderSecond.id!);
    await checkoutUseCase.checkout(orderFourth.id!);

    paymentGateway.createPaymentDetails({
      paymentId: orderFirst.id!,
      orderId: orderFirst.id!,
      paymentStatus: OrderPaymentsStatus.APPROVED,
    });
    await processOrderPaymentUseCase.updateOrderPaymentStatus({
      paymentId: orderFirst.id!,
    });

    paymentGateway.createPaymentDetails({
      paymentId: orderSecond.id!,
      orderId: orderSecond.id!,
      paymentStatus: OrderPaymentsStatus.APPROVED,
    });
    await processOrderPaymentUseCase.updateOrderPaymentStatus({
      paymentId: orderSecond.id!,
    });

    paymentGateway.createPaymentDetails({
      paymentId: orderFourth.id!,
      orderId: orderFourth.id!,
      paymentStatus: OrderPaymentsStatus.APPROVED,
    });
    await processOrderPaymentUseCase.updateOrderPaymentStatus({
      paymentId: orderFourth.id!,
    });

    await updateOrderStatusUseCase.updateOrderStatus(
      Number(orderFirst.id),
      RECEIVED
    );

    await updateOrderStatusUseCase.updateOrderStatus(
      Number(orderSecond.id),
      RECEIVED
    );
    await updateOrderStatusUseCase.updateOrderStatus(
      Number(orderSecond.id),
      PREPARING
    );

    await updateOrderStatusUseCase.updateOrderStatus(
      Number(orderFourth.id),
      RECEIVED
    );
    await updateOrderStatusUseCase.updateOrderStatus(
      Number(orderFourth.id),
      PREPARING
    );
    await updateOrderStatusUseCase.updateOrderStatus(
      Number(orderFourth.id),
      DONE
    );

    const orders = await getOrdersUseCase.getOrders();

    const [doneOrder, preparingOrder, receivedOrder] = orders;

    expect(orders).not.to.be.undefined;
    expect(orders.length).to.be.equals(3);

    expect(doneOrder.status).to.be.equals(DONE);
    expect(preparingOrder.status).to.be.equals(PREPARING);
    expect(receivedOrder.status).to.be.equals(RECEIVED);
  });

  it("should sort the requests by status and from oldest to newest", async () => {
    const createOrderUseCase = setupCreateOrderUseCase();
    const checkoutUseCase = setupCheckoutUseCase();
    const updateOrderStatusUseCase = setupUpdateOrderStatusUseCase();
    const getOrdersUseCase = setupGetOrdersUseCase();
    const processOrderPaymentUseCase = setupProcessOrderPaymentUseCase();

    const { RECEIVED, PREPARING } = OrderStatus;
    const orderDTO = await createOrderDTO();

    const orderFirst = await createOrderUseCase.createOrder(orderDTO);
    await delay(10);
    const orderSecond = await createOrderUseCase.createOrder(orderDTO);
    await delay(10);
    const orderThird = await createOrderUseCase.createOrder(orderDTO);

    await addItemToOrder(orderFirst.id!);
    await addItemToOrder(orderSecond.id!);
    await addItemToOrder(orderThird.id!);

    await checkoutUseCase.checkout(orderFirst.id!);
    await checkoutUseCase.checkout(orderSecond.id!);
    await checkoutUseCase.checkout(orderThird.id!);

    paymentGateway.createPaymentDetails({
      paymentId: orderFirst.id!,
      orderId: orderFirst.id!,
      paymentStatus: OrderPaymentsStatus.APPROVED,
    });
    await processOrderPaymentUseCase.updateOrderPaymentStatus({
      paymentId: orderFirst.id!,
    });

    paymentGateway.createPaymentDetails({
      paymentId: orderSecond.id,
      orderId: orderSecond.id!,
      paymentStatus: OrderPaymentsStatus.APPROVED,
    });
    await processOrderPaymentUseCase.updateOrderPaymentStatus({
      paymentId: orderSecond.id!,
    });

    paymentGateway.createPaymentDetails({
      paymentId: orderThird.id!,
      orderId: orderThird.id!,
      paymentStatus: OrderPaymentsStatus.APPROVED,
    });
    await processOrderPaymentUseCase.updateOrderPaymentStatus({
      paymentId: orderThird.id!,
    });

    await updateOrderStatusUseCase.updateOrderStatus(
      Number(orderFirst.id),
      RECEIVED
    );
    await updateOrderStatusUseCase.updateOrderStatus(
      Number(orderThird.id),
      RECEIVED
    );
    await updateOrderStatusUseCase.updateOrderStatus(
      Number(orderThird.id),
      PREPARING
    );
    await updateOrderStatusUseCase.updateOrderStatus(
      Number(orderSecond.id),
      RECEIVED
    );
    await updateOrderStatusUseCase.updateOrderStatus(
      Number(orderSecond.id),
      PREPARING
    );

    const orders = await getOrdersUseCase.getOrders();

    const [first, second, third] = orders;

    expect(orders).not.to.be.undefined;
    expect(orders.length).to.be.equals(3);

    expect(first.id).to.be.equals(orderSecond.id);
    expect(first.status).to.be.equals(PREPARING);

    expect(second.id).to.be.equals(orderThird.id);
    expect(second.status).to.be.equals(PREPARING);

    expect(third.id).to.be.equals(orderFirst.id);
    expect(third.status).to.be.equals(RECEIVED);
  });

  it("should not return orders with 'Finished' status", async () => {
    const createOrderUseCase = setupCreateOrderUseCase();
    const checkoutUseCase = setupCheckoutUseCase();
    const updateOrderStatusUseCase = setupUpdateOrderStatusUseCase();
    const getOrdersUseCase = setupGetOrdersUseCase();
    const processOrderPaymentUseCase = setupProcessOrderPaymentUseCase();

    const { DONE, RECEIVED, PREPARING, FINISHED } = OrderStatus;
    const orderDTO = await createOrderDTO();

    const orderFirst = await createOrderUseCase.createOrder(orderDTO);
    await addItemToOrder(orderFirst.id!);
    await checkoutUseCase.checkout(orderFirst.id!);

    paymentGateway.createPaymentDetails({
      paymentId: orderFirst.id!,
      orderId: orderFirst.id!,
      paymentStatus: OrderPaymentsStatus.APPROVED,
    });
    await processOrderPaymentUseCase.updateOrderPaymentStatus({
      paymentId: orderFirst.id!,
    });

    await updateOrderStatusUseCase.updateOrderStatus(
      Number(orderFirst.id),
      RECEIVED
    );
    await updateOrderStatusUseCase.updateOrderStatus(
      Number(orderFirst.id),
      PREPARING
    );
    await updateOrderStatusUseCase.updateOrderStatus(
      Number(orderFirst.id),
      DONE
    );
    await updateOrderStatusUseCase.updateOrderStatus(
      Number(orderFirst.id),
      FINISHED
    );

    await createOrderUseCase.createOrder(orderDTO);

    const orderThird = await createOrderUseCase.createOrder(orderDTO);
    await addItemToOrder(orderThird.id!);
    await checkoutUseCase.checkout(orderThird.id!);
    paymentGateway.createPaymentDetails({
      paymentId: orderThird.id!,
      orderId: orderThird.id!,
      paymentStatus: OrderPaymentsStatus.APPROVED,
    });
    await processOrderPaymentUseCase.updateOrderPaymentStatus({
      paymentId: orderThird.id!,
    });
    await updateOrderStatusUseCase.updateOrderStatus(
      Number(orderThird.id),
      RECEIVED
    );

    const orders = await getOrdersUseCase.getOrders();
    const [order] = orders;
    expect(orders).to.not.be.undefined;
    expect(orders.length).to.be.equals(1);
    expect(order.id).to.be.equals(orderThird.id);
    expect(order.status).not.to.be.equals(FINISHED);
    expect(order.status).to.be.equals(RECEIVED);
  });
});
