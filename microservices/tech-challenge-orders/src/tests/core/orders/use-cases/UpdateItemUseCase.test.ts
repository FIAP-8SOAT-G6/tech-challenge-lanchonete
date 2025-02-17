import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";

import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";
import ItemDTO from "../../../../core/orders/dto/ItemDTO";
import OrderDTO from "../../../../core/orders/dto/OrderDTO";
import ProductDTO from "../../../../core/products/dto/ProductDTO";

import OrderGateway from "../../../../core/interfaces/OrderGateway";
import FakeCustomerGateway from "../../../../gateways/FakeCustomerGateway";
import FakeOrderGateway from "../../../../gateways/FakeOrderGateway";
import FakeProductGateway from "../../../../gateways/FakeProductGateway";

import AddItemUseCase from "../../../../core/orders/use-cases/AddItemUseCase";
import CreateOrderUseCase from "../../../../core/orders/use-cases/CreateOrderUseCase";
import UpdateItemUseCase from "../../../../core/orders/use-cases/UpdateItemUseCase";

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

describe("Update item", () => {
  beforeEach(() => {
    customerGateway = new FakeCustomerGateway();
    orderGateway = new FakeOrderGateway();
    productGateway = new FakeProductGateway();
  });

  function setupCreateOrderUseCase() {
    return new CreateOrderUseCase(orderGateway, customerGateway);
  }

  function setupAddItemUseCase() {
    return new AddItemUseCase(orderGateway, productGateway);
  }

  function setupUpdateItemUseCase() {
    return new UpdateItemUseCase(orderGateway);
  }

  async function createCustomer() {
    return customerGateway.create(CUSTOMER_DTO);
  }

  async function createProduct() {
    return productGateway.createProduct(PRODUCT_DTO);
  }

  async function createOrderDTO() {
    const customer = await createCustomer();
    return new OrderDTO({ customerId: customer!.id });
  }

  it("should update item from order", async () => {
    const createOrderUseCase = setupCreateOrderUseCase();
    const addItemUseCase = setupAddItemUseCase();
    const updateItemUseCase = setupUpdateItemUseCase();

    const product = await createProduct();
    const orderDTO = await createOrderDTO();
    const order = await createOrderUseCase.createOrder(orderDTO);
    const itemDTO = new ItemDTO({
      productId: product.id,
      quantity: 2,
    });
    const orderWithItems = await addItemUseCase.addItem(order.id!, itemDTO);

    const item = orderWithItems.items![0];
    const updateItemDTO = new ItemDTO({ quantity: 3 });
    const orderWithUpdatedItems = await updateItemUseCase.updateItem(
      order.id!,
      item.id!,
      updateItemDTO
    );

    const updatedItem = orderWithUpdatedItems.items![0];
    expect(updatedItem.quantity).to.be.equals(3);
    expect(updatedItem.totalPrice).to.be.equals(3 * product.price!);
  });

  it("should throw error when order does not exist", async () => {
    const updateItemUseCase = setupUpdateItemUseCase();

    const product = await createProduct();
    const unexistingOrderId = -1;
    const itemId = 1;
    const updateItemDTO = new ItemDTO({
      productId: product.id,
      quantity: 2,
    });
    await expect(
      updateItemUseCase.updateItem(unexistingOrderId, itemId, updateItemDTO)
    ).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it("should throw error when item does not exist", async () => {
    const createOrderUseCase = setupCreateOrderUseCase();
    const updateItemUseCase = setupUpdateItemUseCase();

    const orderDTO = await createOrderDTO();
    const order = await createOrderUseCase.createOrder(orderDTO);
    const unexistingItemId = -1;
    const updateItemDTO = new ItemDTO({ quantity: 3 });
    await expect(
      updateItemUseCase.updateItem(order.id!, unexistingItemId, updateItemDTO)
    ).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });
});
