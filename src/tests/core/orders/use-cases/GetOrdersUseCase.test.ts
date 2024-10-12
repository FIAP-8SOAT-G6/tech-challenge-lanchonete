import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { OrderStatus } from "../../../../core/orders/entities/OrderStatus";

import ProductDTO from "../../../../core/products/dto/ProductDTO";
import ItemDTO from "../../../../core/orders/dto/ItemDTO";
import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";
import OrderDTO from "../../../../core/orders/dto/OrderDTO";

import CustomerGateway from "../../../../core/gateways/CustomerGateway";
import OrderGateway from "../../../../core/gateways/OrderGateway";
import ProductGateway from "../../../../core/gateways/ProductGateway";
import FakeCustomerGateway from "../../../../gateways/FakeCustomerGateway";
import FakeOrderGateway from "../../../../gateways/FakeOrderGateway";
import FakeProductGateway from "../../../../gateways/FakeProductGateway";

import CPFValidator from "../../../../core/ports/CPFValidator";
import EmailValidator from "../../../../core/ports/EmailValidator";

import CreateOrderUseCase from "../../../../core/orders/use-cases/CreateOrderUseCase";
import CreateCustomerUseCase from "../../../../core/customers/use-cases/CreateCustomerUseCase";
import CreateProductUseCase from "../../../../core/products/use-cases/CreateProductUseCase";
import AddItemUseCase from "../../../../core/orders/use-cases/AddItemUseCase";
import CheckoutOrderUseCase from "../../../../core/orders/use-cases/CheckoutOrderUseCase";
import UpdateOrderStatusUseCase from "../../../../core/orders/use-cases/UpdateOrderStatusUseCase";
import GetOrdersUseCase from "../../../../core/orders/use-cases/GetOrdersUseCase";

chai.use(chaiAsPromised);

const PRODUCT_DTO = new ProductDTO({
  name: "Hamburguer",
  category: "Lanche",
  description: "Hamburguer used for tests",
  price: 12.99
});

const CUSTOMER_DTO = new CustomerDTO({
  name: "John Doe",
  cpf: "11111111111",
  email: "john.doe@gmail.com"
});

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

let customerGateway: CustomerGateway;
let orderGateway: OrderGateway;
let productGateway: ProductGateway;

describe("Get orders by priority", () => {
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  beforeEach(() => {
    customerGateway = new FakeCustomerGateway();
    orderGateway = new FakeOrderGateway();
    productGateway = new FakeProductGateway();
  });

  function setupCreateOrderUseCase() {
    return new CreateOrderUseCase(orderGateway, customerGateway);
  }

  function setupCheckoutUseCase() {
    return new CheckoutOrderUseCase(orderGateway);
  }

  function setupUpdateOrderStatusUseCase() {
    return new UpdateOrderStatusUseCase(orderGateway);
  }

  function setupCreateProductUseCase() {
    return new CreateProductUseCase(productGateway);
  }

  function setupAddItemUseCase() {
    return new AddItemUseCase(orderGateway, productGateway);
  }

  function setupGetOrdersUseCase() {
    return new GetOrdersUseCase(orderGateway);
  }

  async function addItemToOrder(orderId: number) {
    const createProductUseCase = setupCreateProductUseCase();
    const addItemUseCase = setupAddItemUseCase();

    const product = await createProductUseCase.createProduct(PRODUCT_DTO);
    const itemDTO = new ItemDTO({
      productId: product.id,
      quantity: 2
    });
    return await addItemUseCase.addItem(orderId, itemDTO);
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

    const { DONE, RECEIVED, PREPARING } = OrderStatus;

    const orderDTO = await createOrderDTO();
    const orderFirst = await createOrderUseCase.createOrder(orderDTO);
    const orderSecond = await createOrderUseCase.createOrder(orderDTO);
    const orderThird = await createOrderUseCase.createOrder(orderDTO);
    const orderFourth = await createOrderUseCase.createOrder(orderDTO);

    await addItemToOrder(orderFirst.id!);
    await addItemToOrder(orderSecond.id!);
    await addItemToOrder(orderThird.id!); //pedido que irá ficar em aberto
    await addItemToOrder(orderFourth.id!);

    await checkoutUseCase.checkout(orderFirst.id!);
    await checkoutUseCase.checkout(orderSecond.id!);
    await checkoutUseCase.checkout(orderFourth.id!);

    await updateOrderStatusUseCase.updateOrderStatus(Number(orderFirst.id), RECEIVED);

    await updateOrderStatusUseCase.updateOrderStatus(Number(orderSecond.id), RECEIVED);
    await updateOrderStatusUseCase.updateOrderStatus(Number(orderSecond.id), PREPARING);

    await updateOrderStatusUseCase.updateOrderStatus(Number(orderFourth.id), RECEIVED);
    await updateOrderStatusUseCase.updateOrderStatus(Number(orderFourth.id), PREPARING);
    await updateOrderStatusUseCase.updateOrderStatus(Number(orderFourth.id), DONE);

    const orders = await getOrdersUseCase.getOrders();

    const [firstOrder, secondOrder, thirdOrder] = orders;

    expect(orders).not.to.be.undefined;
    expect(orders.length).to.be.equals(3);

    expect(firstOrder.status).to.be.equals(DONE);
    expect(secondOrder.status).to.be.equals(PREPARING);
    expect(thirdOrder.status).to.be.equals(RECEIVED);
  });

  it("should sort the requests by status and from oldest to newest", async () => {
    const createOrderUseCase = setupCreateOrderUseCase();
    const checkoutUseCase = setupCheckoutUseCase();
    const updateOrderStatusUseCase = setupUpdateOrderStatusUseCase();
    const getOrdersUseCase = setupGetOrdersUseCase();

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

    await updateOrderStatusUseCase.updateOrderStatus(Number(orderFirst.id), RECEIVED);
    await updateOrderStatusUseCase.updateOrderStatus(Number(orderThird.id), RECEIVED);
    await updateOrderStatusUseCase.updateOrderStatus(Number(orderThird.id), PREPARING);
    await updateOrderStatusUseCase.updateOrderStatus(Number(orderSecond.id), RECEIVED);
    await updateOrderStatusUseCase.updateOrderStatus(Number(orderSecond.id), PREPARING);

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

    const { DONE, RECEIVED, PREPARING, FINISHED } = OrderStatus;
    const orderDTO = await createOrderDTO();

    const orderFirst = await createOrderUseCase.createOrder(orderDTO);
    await addItemToOrder(orderFirst.id!);
    await checkoutUseCase.checkout(orderFirst.id!);
    await updateOrderStatusUseCase.updateOrderStatus(Number(orderFirst.id), RECEIVED);
    await updateOrderStatusUseCase.updateOrderStatus(Number(orderFirst.id), PREPARING);
    await updateOrderStatusUseCase.updateOrderStatus(Number(orderFirst.id), DONE);
    await updateOrderStatusUseCase.updateOrderStatus(Number(orderFirst.id), FINISHED);

    await createOrderUseCase.createOrder(orderDTO);

    const orderThird = await createOrderUseCase.createOrder(orderDTO);
    await addItemToOrder(orderThird.id!);
    await checkoutUseCase.checkout(orderThird.id!);
    await updateOrderStatusUseCase.updateOrderStatus(Number(orderThird.id), RECEIVED);

    const orders = await getOrdersUseCase.getOrders();
    const [order] = orders;
    expect(orders).to.not.be.undefined;
    expect(orders.length).to.be.equals(1);
    expect(order.id).to.be.equals(orderThird.id);
    expect(order.status).not.to.be.equals(FINISHED);
    expect(order.status).to.be.equals(RECEIVED);
  });
});
