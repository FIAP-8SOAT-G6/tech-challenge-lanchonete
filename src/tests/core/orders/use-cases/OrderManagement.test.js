const FakeProductRepository = require("../../../../adapters/database/FakeProductRepository");
const FakeOrderRepository = require("../../../../adapters/database/FakeOrderRepository");

const OrderManagement = require("../../../../core/orders/use-cases/OrderManagement");

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const OrderStatus = require("../../../../core/orders/entities/OrderStatus");
const UnexistingOrderError = require("../../../../core/orders/exceptions/UnexistingOrderError");
const UnexistingProductError = require("../../../../core/products/exceptions/UnexistingProductError");
const UnexistingItemError = require("../../../../core/orders/exceptions/UnexistingItemError");

chai.use(chaiAsPromised);
const expect = chai.expect;

function setupUseCase(orderRepository, productRepository) {
  return new OrderManagement(orderRepository, productRepository);
}

function setupOrderRepository() {
  return new FakeOrderRepository();
}

function setupProductRepository() {
  return new FakeProductRepository();
}

let useCase, orderRepository, productRepository;
context("OrderManagement", () => {
  beforeEach(() => {
    orderRepository = setupOrderRepository();
    productRepository = setupProductRepository();
    useCase = setupUseCase(orderRepository, productRepository);
  });

  describe("create", () => {
    it("should create order with status 'CREATED'", async () => {
      const createdOrder = await useCase.create();
      expect(createdOrder).to.not.be.undefined;
      expect(createdOrder.id).to.not.be.undefined;
      expect(createdOrder.status).to.be.equals(OrderStatus.CREATED);
      expect(createdOrder.code).to.not.be.undefined;
    });
  });
  describe("getOrders", () => {
    it("should return all orders", async () => {
      await Promise.all([useCase.create(), useCase.create()]);
      const orders = await useCase.getOrders();
      expect(orders).to.not.be.undefined;
      expect(orders.length).to.be.equals(2);
    });
  });
  describe("getOrder", () => {
    it("should return requested order", async () => {
      const order = await useCase.create();
      const requestedOrder = await useCase.getOrder(order.id);

      expect(requestedOrder).to.not.be.undefined;
      expect(requestedOrder.id).to.be.equals(order.id);
      expect(requestedOrder.status).to.be.equals(order.status);
      expect(requestedOrder.code).to.be.equals(order.code);
    });
    it("should throw error when order does not exist", async () => {
      const unexistingOrderId = -1;
      await expect(
        useCase.getOrder(unexistingOrderId)
      ).to.be.eventually.rejectedWith(
        new UnexistingOrderError(unexistingOrderId).message
      );
    });
  });
  describe("addItem", () => {
    it("should add item to order", async () => {
      const product = await productRepository.create({
        name: "Hamburguer",
        category: "Lanche",
        description: "Hamburguer used for tests",
        price: 12.99
      });
      const order = await useCase.create();

      const orderWithItems = await useCase.addItem(order.id, {
        productId: product.id,
        quantity: 2
      });

      expect(orderWithItems).to.not.be.undefined;
      expect(orderWithItems.items).to.not.be.undefined;
      expect(orderWithItems.items.length).to.be.at.least(1);

      const createdItem = orderWithItems.items[0];
      expect(createdItem.id).to.not.be.undefined;
      expect(createdItem.productId).to.be.equals(product.id);
      expect(createdItem.quantity).to.be.equals(2);
      expect(createdItem.totalPrice).to.be.equals(
        createdItem.quantity * product.price
      );
    });
    it("should throw error when order does not exist", async () => {
      const product = await productRepository.create({
        name: "Hamburguer",
        category: "Lanche",
        description: "Hamburguer used for tests",
        price: 12.99
      });
      const unexistingOrderId = -1;

      await expect(
        useCase.addItem(unexistingOrderId, {
          productId: product.id,
          quantity: 2
        })
      ).to.be.eventually.rejectedWith(
        new UnexistingOrderError(unexistingOrderId).message
      );
    });
    it("should throw error when product does not exist", async () => {
      const unexistingProductId = -1;
      const order = await useCase.create();

      await expect(
        useCase.addItem(order.id, {
          productId: unexistingProductId,
          quantity: 2
        })
      ).to.be.eventually.rejectedWith(
        new UnexistingProductError(unexistingProductId).message
      );
    });
  });
  describe("removeItem", () => {
    it("should remove item from order", async () => {
      const product = await productRepository.create({
        name: "Hamburguer",
        category: "Lanche",
        description: "Hamburguer used for tests",
        price: 12.99
      });
      const order = await useCase.create();
      const orderWithItems = await useCase.addItem(order.id, {
        productId: product.id,
        quantity: 2
      });
      const item = orderWithItems.items[0];

      await useCase.removeItem(orderWithItems.id, item.id);

      const updatedOrder = await useCase.getOrder(orderWithItems.id);
      expect(updatedOrder.items.length).to.be.equals(0);
    });
  });
  describe("updateItem", () => {
    it("should update item from order", async () => {
      const product = await productRepository.create({
        name: "Hamburguer",
        category: "Lanche",
        description: "Hamburguer used for tests",
        price: 12.99
      });
      const order = await useCase.create();

      const orderWithItems = await useCase.addItem(order.id, {
        productId: product.id,
        quantity: 2
      });

      const item = orderWithItems.items[0];
      const orderWithUpdatedItems = await useCase.updateItem(
        order.id,
        item.id,
        { quantity: 3 }
      );

      const updatedItem = orderWithUpdatedItems.items[0];
      expect(updatedItem.quantity).to.be.equals(3);
      expect(updatedItem.totalPrice).to.be.equals(3 * product.price);
    });
    it("should throw error when order does not exist", async () => {
      const product = await productRepository.create({
        name: "Hamburguer",
        category: "Lanche",
        description: "Hamburguer used for tests",
        price: 12.99
      });
      const unexistingOrderId = -1;
      const itemId = 1;

      await expect(
        useCase.updateItem(unexistingOrderId, itemId, {
          productId: product.id,
          quantity: 2
        })
      ).to.be.eventually.rejectedWith(
        new UnexistingOrderError(unexistingOrderId).message
      );
    });
    it("should throw error when item does not exist", async () => {
      const order = await useCase.create();
      const unexistingItemId = -1;

      await expect(
        useCase.updateItem(order.id, unexistingItemId, { quantity: 3 })
      ).to.be.eventually.rejectedWith(
        new UnexistingItemError(unexistingItemId).message
      );
    });
  });
});
