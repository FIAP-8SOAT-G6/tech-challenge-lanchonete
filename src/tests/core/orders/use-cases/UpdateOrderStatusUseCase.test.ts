import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

import { OrderStatus } from "../../../../core/orders/entities/OrderStatus";
import { OrderPaymentsStatus } from "../../../../core/orders/entities/OrderPaymentsStatus";

import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";

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
import PaymentGateway from "../../../../core/interfaces/PaymentGateway";

import CreateOrderUseCase from "../../../../core/orders/use-cases/CreateOrderUseCase";
import CreateCustomerUseCase from "../../../../core/customers/use-cases/CreateCustomerUseCase";
import CreateProductUseCase from "../../../../core/products/use-cases/CreateProductUseCase";
import AddItemUseCase from "../../../../core/orders/use-cases/AddItemUseCase";
import CheckoutOrderUseCase from "../../../../core/orders/use-cases/CheckoutOrderUseCase";
import UpdateOrderStatusUseCase from "../../../../core/orders/use-cases/UpdateOrderStatusUseCase";
import GetOrderUseCase from "../../../../core/orders/use-cases/GetOrderUseCase";
import ProcessOrderPaymentUseCase from "../../../../core/orders/use-cases/ProcessOrderPaymentUseCase";

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

let customerGateway: CustomerGateway;
let orderGateway: OrderGateway;
let productGateway: ProductGateway;
let paymentGateway: PaymentGateway;

describe("Update Order Status", () => {
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

  function setupGetOrderUseCase() {
    return new GetOrderUseCase(orderGateway);
  }

  function setupCreateProductUseCase() {
    return new CreateProductUseCase(productGateway);
  }

  function setupAddItemUseCase() {
    return new AddItemUseCase(orderGateway, productGateway);
  }

  function setupProcessOrderPaymentUseCase() {
    return new ProcessOrderPaymentUseCase(orderGateway, paymentGateway);
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
    const customeUseCase = new CreateCustomerUseCase(customerGateway);
    return await customeUseCase.create(CUSTOMER_DTO);
  }

  async function createOrderDTO() {
    const customer = await createCustomer();
    return new OrderDTO({ customerId: customer!.id });
  }

  it("should update order status by id", async () => {
    const createOrderUseCase = setupCreateOrderUseCase();
    const checkoutUseCase = setupCheckoutUseCase();
    const updateOrderStatusUseCase = setupUpdateOrderStatusUseCase();
    const getOrderUseCase = setupGetOrderUseCase();
    const processOrderPaymentUseCase = setupProcessOrderPaymentUseCase();

    const { RECEIVED } = OrderStatus;
    const orderDTO = await createOrderDTO();
    const order = await createOrderUseCase.createOrder(orderDTO);

    await addItemToOrder(order.id!);
    await checkoutUseCase.checkout(order.id!);

    paymentGateway.createPaymentDetails({ paymentId: order.id!, orderId: order.id!, paymentStatus: OrderPaymentsStatus.APPROVED });
    await processOrderPaymentUseCase.updateOrderPaymentStatus({ paymentId: order.id! });
    await updateOrderStatusUseCase.updateOrderStatus(order.id!, RECEIVED);

    const orderUpdated = await getOrderUseCase.getOrder(order.id!);
    expect(orderUpdated?.status).to.be.equals(RECEIVED);
  });

  it("should return an error when the order does not exist", async () => {
    const updateOrderStatusUseCase = setupUpdateOrderStatusUseCase();

    const { RECEIVED } = OrderStatus;
    const nonExistingOrderId = -1;
    await expect(updateOrderStatusUseCase.updateOrderStatus(nonExistingOrderId, RECEIVED)).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });
});
