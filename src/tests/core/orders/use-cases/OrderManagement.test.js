const FakeProductRepository = require("../../../../adapters/database/FakeProductRepository");
const FakeOrderRepository = require("../../../../adapters/database/FakeOrderRepository");

const OrderManagement = require("../../../../core/orders/use-cases/OrderManagement");

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const OrderStatus = require("../../../../core/orders/entities/OrderStatus");

const UnexistingOrderError = require("../../../../core/orders/exceptions/UnexistingOrderError");
const UnexistingItemError = require("../../../../core/orders/exceptions/UnexistingItemError");
const UnexistingProductError = require("../../../../core/products/exceptions/UnexistingProductError");

const ProductDTO = require("../../../../core/products/dto/ProductDTO");
const ItemDTO = require("../../../../core/orders/dto/ItemDTO");
const EmptyOrderError = require("../../../../core/orders/exceptions/EmptyOrderError");

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

const PRODUCT_DTO = new ProductDTO({
  name: "Hamburguer",
  category: "Lanche",
  description: "Hamburguer used for tests",
  price: 12.99
});

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
      const product = await productRepository.create(PRODUCT_DTO);
      const order = await useCase.create();
      const itemDTO = new ItemDTO({
        productId: product.id,
        quantity: 2
      });

      const orderWithItems = await useCase.addItem(order.id, itemDTO);

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
      const product = await productRepository.create(PRODUCT_DTO);
      const unexistingOrderId = -1;
      const itemDTO = new ItemDTO({
        productId: product.id,
        quantity: 2
      });
      await expect(
        useCase.addItem(unexistingOrderId, itemDTO)
      ).to.be.eventually.rejectedWith(
        new UnexistingOrderError(unexistingOrderId).message
      );
    });
    it("should throw error when product does not exist", async () => {
      const unexistingProductId = -1;
      const order = await useCase.create();
      const itemDTO = new ItemDTO({
        productId: unexistingProductId,
        quantity: 2
      });
      await expect(
        useCase.addItem(order.id, itemDTO)
      ).to.be.eventually.rejectedWith(
        new UnexistingProductError(unexistingProductId).message
      );
    });
  });
  describe("removeItem", () => {
    it("should remove item from order", async () => {
      const product = await productRepository.create(PRODUCT_DTO);
      const order = await useCase.create();
      const itemDTO = new ItemDTO({
        productId: product.id,
        quantity: 2
      });

      const orderWithItems = await useCase.addItem(order.id, itemDTO);
      const item = orderWithItems.items[0];

      await useCase.removeItem(orderWithItems.id, item.id);

      const updatedOrder = await useCase.getOrder(orderWithItems.id);
      expect(updatedOrder.items.length).to.be.equals(0);
    });
  });
  describe("updateItem", () => {
    it("should update item from order", async () => {
      const product = await productRepository.create(PRODUCT_DTO);
      const order = await useCase.create();
      const itemDTO = new ItemDTO({
        productId: product.id,
        quantity: 2
      });
      const orderWithItems = await useCase.addItem(order.id, itemDTO);

      const item = orderWithItems.items[0];
      const updateItemDTO = new ItemDTO({ quantity: 3 });
      const orderWithUpdatedItems = await useCase.updateItem(
        order.id,
        item.id,
        updateItemDTO
      );

      const updatedItem = orderWithUpdatedItems.items[0];
      expect(updatedItem.quantity).to.be.equals(3);
      expect(updatedItem.totalPrice).to.be.equals(3 * product.price);
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
      ).to.be.eventually.rejectedWith(
        new UnexistingOrderError(unexistingOrderId).message
      );
    });
    it("should throw error when item does not exist", async () => {
      const order = await useCase.create();
      const unexistingItemId = -1;
      const updateItemDTO = new ItemDTO({ quantity: 3 });
      await expect(
        useCase.updateItem(order.id, unexistingItemId, updateItemDTO)
      ).to.be.eventually.rejectedWith(
        new UnexistingItemError(unexistingItemId).message
      );
    });
  });
  describe("checkout", () => {
    it("should change status if order has items", async () => {
      const product = await productRepository.create(PRODUCT_DTO);
      const order = await useCase.create();
      const itemDTO = new ItemDTO({
        productId: product.id,
        quantity: 2
      });
      await useCase.addItem(order.id, itemDTO);

      await expect(
        useCase.checkout(order.id)
      ).to.not.be.eventually.rejectedWith(EmptyOrderError);
      const updatedOrder = await useCase.getOrder(order.id);

      expect(updatedOrder.status).to.not.be.equals(OrderStatus.CREATED);
    });
    it("should not change status if order has no items", async () => {
      const order = await useCase.create();

      await expect(
        useCase.checkout(order.id)
      ).to.be.eventually.rejectedWith(EmptyOrderError);
      const updatedOrder = await useCase.getOrder(order.id);
      expect(updatedOrder.status).to.be.equals(OrderStatus.CREATED);
    });
  });
});
