import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";
import OrderDTO from "../../../../core/orders/dto/OrderDTO";
import ProductDTO from "../../../../core/products/dto/ProductDTO";
import ItemDTO from "../../../../core/orders/dto/ItemDTO";

import CreateCustomerUseCase from "../../../../core/customers/use-cases/CreateCustomerUseCase";
import GetOrdersAllUseCase from "../../../../core/orders/use-cases/GetOrdersAllUseCase";
import CreateOrderUseCase from "../../../../core/orders/use-cases/CreateOrderUseCase";
import CreateProductUseCase from "../../../../core/products/use-cases/CreateProductUseCase";
import AddItemUseCase from "../../../../core/orders/use-cases/AddItemUseCase";

import OrderGateway from "../../../../core/interfaces/OrderGateway";
import FakeOrderGateway from "../../../../gateways/FakeOrderGateway";
import FakeCustomerGateway from "../../../../gateways/FakeCustomerGateway";
import CustomerGateway from "../../../../core/interfaces/CustomerGateway";
import FakeProductGateway from "../../../../gateways/FakeProductGateway";

chai.use(chaiAsPromised);

const CUSTOMER_DTO = new CustomerDTO({
  name: "John Doe",
  cpf: "11111111111",
  email: "john.doe@gmail.com"
});

const PRODUCT_DTO = new ProductDTO({
  name: "Hamburguer",
  category: "Lanche",
  description: "Hamburguer used for tests",
  price: 12.99
});

let orderGateway: OrderGateway;
let customerGateway: CustomerGateway;
let productGateway: FakeProductGateway;

context("Get All Orders Use Case", () => {
  beforeEach(() => {
    customerGateway = new FakeCustomerGateway();
    productGateway = new FakeProductGateway();
    orderGateway = new FakeOrderGateway();
  });

  function setupCreateOrderUseCase() {
    return new CreateOrderUseCase(orderGateway, customerGateway);
  }

  function setupGetOrdersAllUseCase() {
    return new GetOrdersAllUseCase(orderGateway);
  }

  async function createCustomer() {
    const customerUseCase = new CreateCustomerUseCase(customerGateway);
    return await customerUseCase.create(CUSTOMER_DTO);
  }

  async function createOrderDTO() {
    const customer = await createCustomer();
    return new OrderDTO({ customerId: customer!.id });
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

    it("should return all orders with items", async () => {
      const createOrderUseCase = setupCreateOrderUseCase();
      const getOrdersAllUseCase = setupGetOrdersAllUseCase();

      const orderDTO = await createOrderDTO();

      const firstOrder = await createOrderUseCase.createOrder(orderDTO);
      const secondOrder = await createOrderUseCase.createOrder(orderDTO);

      await addItemToOrder(firstOrder.id!);
      await addItemToOrder(secondOrder.id!);

      const orders = await getOrdersAllUseCase.getOrdersAll();
      expect(orders).to.not.be.undefined;
      expect(orders?.length).to.be.equals(2);

      expect(orders[0].items?.length).to.be.equals(1);
      expect(orders[1].items?.length).to.be.equals(1);
    });
  });
});
