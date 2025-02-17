import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";
import ItemDTO from "../../../../core/orders/dto/ItemDTO";
import OrderDTO from "../../../../core/orders/dto/OrderDTO";
import ProductDTO from "../../../../core/products/dto/ProductDTO";

import OrderGateway from "../../../../core/interfaces/OrderGateway";
import FakeCustomerGateway from "../../../../gateways/FakeCustomerGateway";
import FakeOrderGateway from "../../../../gateways/FakeOrderGateway";
import FakeProductGateway from "../../../../gateways/FakeProductGateway";

import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";
import AddItemUseCase from "../../../../core/orders/use-cases/AddItemUseCase";
import CreateOrderUseCase from "../../../../core/orders/use-cases/CreateOrderUseCase";
import DeleteItemUseCase from "../../../../core/orders/use-cases/DeleteItemUseCase";
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
  orderGateway: OrderGateway;

describe("Delete Item", () => {
  beforeEach(() => {
    customerGateway = new FakeCustomerGateway();
    orderGateway = new FakeOrderGateway();
    productGateway = new FakeProductGateway();
  });

  function setupCreateOrderUseCase() {
    return new CreateOrderUseCase(orderGateway, customerGateway);
  }

  function setupGetOrderUseCase() {
    return new GetOrderUseCase(orderGateway);
  }

  function setupAddItemUseCase() {
    return new AddItemUseCase(orderGateway, productGateway);
  }

  function setupDeleteItemUseCase() {
    return new DeleteItemUseCase(orderGateway);
  }

  async function createCustomer() {
    return await customerGateway.create(CUSTOMER_DTO);
  }

  async function createProduct() {
    return productGateway.createProduct(PRODUCT_DTO);
  }

  it("should remove item from order", async () => {
    const createOrderUseCase = setupCreateOrderUseCase();
    const getOrderUseCase = setupGetOrderUseCase();
    const addItemUseCase = setupAddItemUseCase();
    const deleteItemUseCase = setupDeleteItemUseCase();

    const product = await createProduct();
    const customer = await createCustomer();
    const orderDTO = new OrderDTO({ customerId: customer!.id });
    const order = await createOrderUseCase.createOrder(orderDTO);
    const itemDTO = new ItemDTO({
      productId: product.id,
      quantity: 2,
    });

    const orderWithItems = await addItemUseCase.addItem(order.id!, itemDTO);
    const item = orderWithItems.items![0];

    await deleteItemUseCase.deleteItem(orderWithItems.id!, item.id!);

    const updatedOrder = await getOrderUseCase.getOrder(orderWithItems.id!);
    expect(updatedOrder?.items!.length).to.be.equals(0);
  });

  it("should return an error when the order does not exist", async () => {
    const deleteItemUseCase = setupDeleteItemUseCase();

    const unexistingOrderId = -1;
    const unexistingItemId = -1;
    await expect(
      deleteItemUseCase.deleteItem(unexistingOrderId, unexistingItemId)
    ).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });
});
