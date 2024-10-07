import FakeProductRepository from "../../../../adapters/database/FakeProductRepository";
import FakeOrderRepository from "../../../../adapters/database/FakeOrderRepository";
import FakeCustomerRepository from "../../../../adapters/database/FakeCustomerRepository";

import OrderManagement from "../../../../core/orders/use-cases/OrderManagement";

import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { OrderStatus } from "../../../../core/orders/entities/OrderStatus";

import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";

import ProductDTO from "../../../../core/products/dto/ProductDTO";
import ItemDTO from "../../../../core/orders/dto/ItemDTO";
import EmptyOrderError from "../../../../core/orders/exceptions/EmptyOrderError";
import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";
import OrderDTO from "../../../../core/orders/dto/OrderDTO";
import OrderRepository from "../../../../core/ports/OrderRepository";
import ProductRepository from "../../../../core/ports/ProductRepository";
import CustomerRepository from "../../../../core/ports/CustomerRepository";

chai.use(chaiAsPromised);

function setupUseCase(
  orderRepository: OrderRepository,
  productRepository: ProductRepository,
  customerRepository: CustomerRepository
) {
  return new OrderManagement(
    orderRepository,
    productRepository,
    customerRepository
  );
}

function setupOrderRepository() {
  return new FakeOrderRepository();
}

function setupProductRepository() {
  return new FakeProductRepository();
}

function setupCustomerRepository() {
  return new FakeCustomerRepository();
}

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

let useCase: OrderManagement,
  orderRepository: FakeOrderRepository,
  productRepository: FakeProductRepository,
  customerRepository: FakeCustomerRepository;
context("OrderManagement", () => {
  beforeEach(() => {
    orderRepository = setupOrderRepository();
    productRepository = setupProductRepository();
    customerRepository = setupCustomerRepository();
    useCase = setupUseCase(
      orderRepository,
      productRepository,
      customerRepository
    );
  });

  describe("create", () => {
    it("should create order with status 'CREATED'", async () => {
      const customer = await customerRepository.create(CUSTOMER_DTO);
      const orderDTO = new OrderDTO({ customerId: customer!.id });
      const createdOrder = await useCase.create(orderDTO);
      expect(createdOrder).to.not.be.undefined;
      expect(createdOrder.id).to.not.be.undefined;
      expect(createdOrder.status).to.be.equals(OrderStatus.CREATED);
      expect(createdOrder.code).to.not.be.undefined;
      expect(createdOrder.elapsedTime).to.not.be.undefined;
    });
    it("should not throw an error when creating order with anonymous customer", async () => {
      const anonymousCustomerId = null;
      const orderDTO = new OrderDTO({ customerId: anonymousCustomerId });

      const createOrderPromise = useCase.create(orderDTO);
      await expect(createOrderPromise).to.not.be.eventually.rejectedWith(
        ResourceNotFoundError
      );
      const createdOrder = await createOrderPromise;
      expect(createdOrder).to.not.be.undefined;
      expect(createdOrder.customerId).to.be.null;
    });
    it("should throw an error when creating order with unexisting customer", async () => {
      const unexistingCustomerId = -1;
      const orderDTO = new OrderDTO({ customerId: unexistingCustomerId });
      await expect(useCase.create(orderDTO)).to.be.eventually.rejectedWith(
        ResourceNotFoundError
      );
    });
  });
  describe("getOrders", () => {
    it("should return all orders", async () => {
      const customer = await customerRepository.create(CUSTOMER_DTO);
      const orderDTO = new OrderDTO({ customerId: customer!.id });
      await Promise.all([useCase.create(orderDTO), useCase.create(orderDTO)]);
      const orders = await useCase.getOrders();
      expect(orders).to.not.be.undefined;
      expect(orders.length).to.be.equals(2);
    });
  });
  describe("getOrder", () => {
    it("should return requested order", async () => {
      const customer = await customerRepository.create(CUSTOMER_DTO);
      const orderDTO = new OrderDTO({ customerId: customer!.id });
      const order = await useCase.create(orderDTO);
      const requestedOrder = await useCase.getOrder(order.id!);

      expect(requestedOrder).to.not.be.undefined;
      expect(requestedOrder.id).to.be.equals(order.id);
      expect(requestedOrder.status).to.be.equals(order.status);
      expect(requestedOrder.code).to.be.equals(order.code);
    });
    it("should throw error when order does not exist", async () => {
      const unexistingOrderId = -1;
      await expect(
        useCase.getOrder(unexistingOrderId)
      ).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });
  });
  describe("addItem", () => {
    it("should add item to order", async () => {
      const product = await productRepository.create(PRODUCT_DTO);
      const customer = await customerRepository.create(CUSTOMER_DTO);
      const orderDTO = new OrderDTO({ customerId: customer!.id });
      const order = await useCase.create(orderDTO);
      const itemDTO = new ItemDTO({
        productId: product.id,
        quantity: 2
      });

      const orderWithItems = await useCase.addItem(order.id!, itemDTO);

      expect(orderWithItems).to.not.be.undefined;
      expect(orderWithItems.items).to.not.be.undefined;
      expect(orderWithItems.items!.length).to.be.at.least(1);

      const createdItem = orderWithItems.items![0];
      expect(createdItem.id).to.not.be.undefined;
      expect(createdItem.productId).to.be.equals(product.id);
      expect(createdItem.quantity).to.be.equals(2);
      expect(createdItem.totalPrice).to.be.equals(
        createdItem.quantity! * product.price!
      );
    });
    it("should throw error when order does not exist", async () => {
      const product = await productRepository.create(PRODUCT_DTO);
      const unexistingOrderId = -1;
      const itemDTO = new ItemDTO({
        productId: product.id,
        quantity: 2
      });
      await expect(
        useCase.addItem(unexistingOrderId, itemDTO)
      ).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });
    it("should throw error when product does not exist", async () => {
      const unexistingProductId = -1;
      const customer = await customerRepository.create(CUSTOMER_DTO);
      const orderDTO = new OrderDTO({ customerId: customer!.id });
      const order = await useCase.create(orderDTO);
      const itemDTO = new ItemDTO({
        productId: unexistingProductId,
        quantity: 2
      });
      await expect(
        useCase.addItem(order.id!, itemDTO)
      ).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });
  });
  describe("removeItem", () => {
    it("should remove item from order", async () => {
      const product = await productRepository.create(PRODUCT_DTO);
      const customer = await customerRepository.create(CUSTOMER_DTO);
      const orderDTO = new OrderDTO({ customerId: customer!.id });
      const order = await useCase.create(orderDTO);
      const itemDTO = new ItemDTO({
        productId: product.id,
        quantity: 2
      });

      const orderWithItems = await useCase.addItem(order.id!, itemDTO);
      const item = orderWithItems.items![0];

      await useCase.removeItem(orderWithItems.id!, item.id!);

      const updatedOrder = await useCase.getOrder(orderWithItems.id!);
      expect(updatedOrder.items!.length).to.be.equals(0);
    });
  });
  describe("updateItem", () => {
    it("should update item from order", async () => {
      const product = await productRepository.create(PRODUCT_DTO);
      const customer = await customerRepository.create(CUSTOMER_DTO);
      const orderDTO = new OrderDTO({ customerId: customer!.id });
      const order = await useCase.create(orderDTO);
      const itemDTO = new ItemDTO({
        productId: product.id,
        quantity: 2
      });
      const orderWithItems = await useCase.addItem(order.id!, itemDTO);

      const item = orderWithItems.items![0];
      const updateItemDTO = new ItemDTO({ quantity: 3 });
      const orderWithUpdatedItems = await useCase.updateItem(
        order.id!,
        item.id!,
        updateItemDTO
      );

      const updatedItem = orderWithUpdatedItems.items![0];
      expect(updatedItem.quantity).to.be.equals(3);
      expect(updatedItem.totalPrice).to.be.equals(3 * product.price!);
    });
    it("should throw error when order does not exist", async () => {
      const product = await productRepository.create(PRODUCT_DTO);
      const unexistingOrderId = -1;
      const itemId = 1;
      const updateItemDTO = new ItemDTO({
        productId: product.id,
        quantity: 2
      });
      await expect(
        useCase.updateItem(unexistingOrderId, itemId, updateItemDTO)
      ).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });
    it("should throw error when item does not exist", async () => {
      const customer = await customerRepository.create(CUSTOMER_DTO);
      const orderDTO = new OrderDTO({ customerId: customer!.id });
      const order = await useCase.create(orderDTO);
      const unexistingItemId = -1;
      const updateItemDTO = new ItemDTO({ quantity: 3 });
      await expect(
        useCase.updateItem(order.id!, unexistingItemId, updateItemDTO)
      ).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });
  });
  describe("checkout", () => {
    it("should change status if order has items", async () => {
      const product = await productRepository.create(PRODUCT_DTO);
      const customer = await customerRepository.create(CUSTOMER_DTO);
      const orderDTO = new OrderDTO({ customerId: customer!.id });
      const order = await useCase.create(orderDTO);
      const itemDTO = new ItemDTO({
        productId: product.id,
        quantity: 2
      });
      await useCase.addItem(order.id!, itemDTO);

      await expect(
        useCase.checkout(order.id!)
      ).to.not.be.eventually.rejectedWith(EmptyOrderError);
      const updatedOrder = await useCase.getOrder(order.id!);

      expect(updatedOrder.status).to.not.be.equals(OrderStatus.CREATED);
    });
    it("should not change status if order has no items", async () => {
      const customer = await customerRepository.create(CUSTOMER_DTO);
      const orderDTO = new OrderDTO({ customerId: customer!.id });
      const order = await useCase.create(orderDTO);

      await expect(useCase.checkout(order.id!)).to.be.eventually.rejectedWith(
        EmptyOrderError
      );
      const updatedOrder = await useCase.getOrder(order.id!);
      expect(updatedOrder.status).to.be.equals(OrderStatus.CREATED);
    });
  });
});
