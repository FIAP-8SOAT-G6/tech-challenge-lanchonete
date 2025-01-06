import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

import { OrderPaymentsStatus } from "../../../../core/orders/entities/OrderPaymentsStatus";
import { OrderStatus } from "../../../../core/orders/entities/OrderStatus";

import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";
import OrderDTO from "../../../../core/orders/dto/OrderDTO";
import ItemDTO from "../../../../core/orders/dto/ItemDTO";
import ProductDTO from "../../../../core/products/dto/ProductDTO";
import PaymentDTO from "../../../../core/orders/dto/PaymentDTO";

import CustomerGateway from "../../../../core/interfaces/CustomerGateway";
import OrderGateway from "../../../../core/interfaces/OrderGateway";
import FakeCustomerGateway from "../../../../gateways/FakeCustomerGateway";
import FakeOrderGateway from "../../../../gateways/FakeOrderGateway";
import PaymentGateway from "../../../../core/interfaces/PaymentGateway";
import MockPaymentGateway from "../../../../gateways/MockPaymentGateway";
import FakeProductGateway from "../../../../gateways/FakeProductGateway";
import ProductGateway from "../../../../core/interfaces/ProductGateway";

import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";

import CreateOrderUseCase from "../../../../core/orders/use-cases/CreateOrderUseCase";
import CreateCustomerUseCase from "../../../../core/customers/use-cases/CreateCustomerUseCase";
import ProcessOrderPaymentUseCase from "../../../../core/orders/use-cases/ProcessOrderPaymentUseCase";
import CreateProductUseCase from "../../../../core/products/use-cases/CreateProductUseCase";
import AddItemUseCase from "../../../../core/orders/use-cases/AddItemUseCase";
import CheckoutOrderUseCase from "../../../../core/orders/use-cases/CheckoutOrderUseCase";
import UpdateOrderStatusUseCase from "../../../../core/orders/use-cases/UpdateOrderStatusUseCase";
import GetOrderUseCase from "../../../../core/orders/use-cases/GetOrderUseCase";

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
let paymentGateway: PaymentGateway;
let productGateway: ProductGateway;

describe("Process Order Payment Use Case", () => {
  beforeEach(() => {
    customerGateway = new FakeCustomerGateway();
    orderGateway = new FakeOrderGateway();
    paymentGateway = new MockPaymentGateway();
    productGateway = new FakeProductGateway();
  });

  function setupCreateOrderUseCase() {
    return new CreateOrderUseCase(orderGateway, customerGateway);
  }

  function setupProcessOrderPaymentUseCase() {
    return new ProcessOrderPaymentUseCase(orderGateway, paymentGateway);
  }

  async function createCustomer() {
    const customerUseCase = new CreateCustomerUseCase(customerGateway);
    return await customerUseCase.create(CUSTOMER_DTO);
  }

  async function createOrderDTO() {
    const customer = await createCustomer();
    return new OrderDTO({ customerId: customer!.id });
  }

  function setupCheckoutUseCase() {
    return new CheckoutOrderUseCase(orderGateway, paymentGateway);
  }

  function setupUpdateOrderStatusUseCase() {
    return new UpdateOrderStatusUseCase(orderGateway);
  }

  function setupCreateProductUseCase() {
    return new CreateProductUseCase(productGateway);
  }

  function setupGetOrderUseCase() {
    return new GetOrderUseCase(orderGateway);
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

  it("should update the order status to `PAYED` when payment is `APPROVED`", async () => {
    const createOrderUseCase = setupCreateOrderUseCase();
    const checkoutUseCase = setupCheckoutUseCase();
    const getOrderUseCase = setupGetOrderUseCase();
    const processOrderPaymentUseCase = setupProcessOrderPaymentUseCase();

    const orderDTO = await createOrderDTO();

    const order = await createOrderUseCase.createOrder(orderDTO);
    await addItemToOrder(order.id!);
    await checkoutUseCase.checkout(order.id!);

    paymentGateway.createPaymentDetails({ paymentId: order.id!, orderId: order.id!, paymentStatus: OrderPaymentsStatus.APPROVED });
    await processOrderPaymentUseCase.updateOrderPaymentStatus({ paymentId: order.id! });

    const orderUpdated = await getOrderUseCase.getOrder(order.id!);
    expect(orderUpdated?.id).to.be.equals(order.id);
    expect(orderUpdated?.status).to.be.equals(OrderStatus.PAYED);
    expect(orderUpdated?.paymentStatus).to.be.equals(OrderPaymentsStatus.APPROVED);
  });

  it("should throw error message when payment id non-existing", async () => {
    const processOrderPayment = setupProcessOrderPaymentUseCase();
    const nonExistingId = -1;
    const paymentDTO = new PaymentDTO({ paymentId: nonExistingId });

    await expect(processOrderPayment.updateOrderPaymentStatus(paymentDTO)).to.be.eventually.rejectedWith(
      ResourceNotFoundError,
      "Payment not found for id '-1'"
    );
  });

  it("should throw error message when order id non-existing", async () => {
    const processOrderPayment = setupProcessOrderPaymentUseCase();
    const nonExistingId = -1;
    const paymentDTO = new PaymentDTO({ paymentId: 1, orderId: nonExistingId, paymentStatus: OrderPaymentsStatus.APPROVED });

    paymentGateway.createPaymentDetails(paymentDTO);

    await expect(processOrderPayment.updateOrderPaymentStatus(paymentDTO)).to.be.eventually.rejectedWith(
      ResourceNotFoundError,
      "Order not found for id '-1'"
    );
  });
});
