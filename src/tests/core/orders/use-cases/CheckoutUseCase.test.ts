import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { OrderStatus } from "../../../../core/orders/entities/OrderStatus";

import EmptyOrderError from "../../../../core/orders/exceptions/EmptyOrderError";

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
import GetOrderUseCase from "../../../../core/orders/use-cases/GetOrderUseCase";
import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";

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

describe("Checkout Order", () => {
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

  function setupGetOrderUseCase() {
    return new GetOrderUseCase(orderGateway);
  }

  function setupCreateProductUseCase() {
    return new CreateProductUseCase(productGateway);
  }

  function setupAddItemUseCase() {
    return new AddItemUseCase(orderGateway, productGateway);
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

  it("should change status if order has items", async () => {
    const createOrderUseCase = setupCreateOrderUseCase();
    const checkoutUseCase = setupCheckoutUseCase();
    const getOrderUseCase = setupGetOrderUseCase();

    const orderDTO = await createOrderDTO();
    const order = await createOrderUseCase.createOrder(orderDTO);
    await addItemToOrder(order.id!);

    await expect(checkoutUseCase.checkout(order.id!)).to.not.be.eventually.rejectedWith(EmptyOrderError);
    const updatedOrder = await getOrderUseCase.getOrder(order.id!);

    expect(updatedOrder?.status).to.not.be.equals(OrderStatus.CREATED);
  });

  it("should not change status if order has no items", async () => {
    const createOrderUseCase = setupCreateOrderUseCase();
    const checkoutUseCase = setupCheckoutUseCase();
    const getOrderUseCase = setupGetOrderUseCase();

    const orderDTO = await createOrderDTO();
    const order = await createOrderUseCase.createOrder(orderDTO);

    await expect(checkoutUseCase.checkout(order.id!)).to.be.eventually.rejectedWith(EmptyOrderError);
    const updatedOrder = await getOrderUseCase.getOrder(order.id!);
    expect(updatedOrder?.status).to.be.equals(OrderStatus.CREATED);
  });

  it("should return an error when the order does not exist", async () => {
    const checkoutUseCase = setupCheckoutUseCase();
    const unexistingOrderId = -1;
    await expect(checkoutUseCase.checkout(unexistingOrderId)).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });
});