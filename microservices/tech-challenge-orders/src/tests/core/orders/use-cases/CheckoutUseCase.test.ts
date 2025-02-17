import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { OrderStatus } from "../../../../core/orders/entities/OrderStatus";

import EmptyOrderError from "../../../../core/orders/exceptions/EmptyOrderError";

import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";
import ItemDTO from "../../../../core/orders/dto/ItemDTO";
import OrderDTO from "../../../../core/orders/dto/OrderDTO";
import ProductDTO from "../../../../core/products/dto/ProductDTO";

import OrderGateway from "../../../../core/interfaces/OrderGateway";
import FakeCustomerGateway from "../../../../gateways/FakeCustomerGateway";
import FakeOrderGateway from "../../../../gateways/FakeOrderGateway";
import FakeProductGateway from "../../../../gateways/FakeProductGateway";
import MockPaymentGateway from "../../../../gateways/MockPaymentGateway";

import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";
import AddItemUseCase from "../../../../core/orders/use-cases/AddItemUseCase";
import CheckoutOrderUseCase from "../../../../core/orders/use-cases/CheckoutOrderUseCase";
import CreateOrderUseCase from "../../../../core/orders/use-cases/CreateOrderUseCase";
import GetOrderUseCase from "../../../../core/orders/use-cases/GetOrderUseCase";

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
  productGateway: FakeProductGateway,
  paymentGateway: MockPaymentGateway,
  orderGateway: OrderGateway;

describe("Checkout Order", () => {
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

  function setupGetOrderUseCase() {
    return new GetOrderUseCase(orderGateway);
  }

  function setupAddItemUseCase() {
    return new AddItemUseCase(orderGateway, productGateway);
  }

  function createProduct() {
    return productGateway.createProduct(PRODUCT_DTO);
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
    return await customerGateway.create(CUSTOMER_DTO);
  }

  async function createOrderDTO() {
    const customer = await createCustomer();
    return new OrderDTO({ customerId: customer!.id });
  }

  it("should change status if order has items", async () => {
    const createOrderUseCase = setupCreateOrderUseCase();
    const checkoutUseCase = setupCheckoutUseCase();
    const getOrderUseCase = setupGetOrderUseCase();

    const orderDTO = await createOrderDTO();
    const order = await createOrderUseCase.createOrder(orderDTO);
    await addItemToOrder(order.id!);

    await expect(
      checkoutUseCase.checkout(order.id!)
    ).to.not.be.eventually.rejectedWith(EmptyOrderError);
    const updatedOrder = await getOrderUseCase.getOrder(order.id!);

    expect(updatedOrder?.status).to.not.be.equals(OrderStatus.CREATED);
  });

  it("should not change status if order has no items", async () => {
    const createOrderUseCase = setupCreateOrderUseCase();
    const checkoutUseCase = setupCheckoutUseCase();
    const getOrderUseCase = setupGetOrderUseCase();

    const orderDTO = await createOrderDTO();
    const order = await createOrderUseCase.createOrder(orderDTO);

    await expect(
      checkoutUseCase.checkout(order.id!)
    ).to.be.eventually.rejectedWith(EmptyOrderError);
    const updatedOrder = await getOrderUseCase.getOrder(order.id!);
    expect(updatedOrder?.status).to.be.equals(OrderStatus.CREATED);
  });

  it("should return an error when the order does not exist", async () => {
    const checkoutUseCase = setupCheckoutUseCase();
    const unexistingOrderId = -1;
    await expect(
      checkoutUseCase.checkout(unexistingOrderId)
    ).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });
});
