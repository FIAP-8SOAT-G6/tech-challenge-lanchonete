const chai = require("chai");
const expect = chai.expect;
const Order = require("../../../../core/orders/entities/Order");
const OrderStatus = require("../../../../core/orders/entities/OrderStatus");
const InvalidStatusTransitionError = require("../../../../core/orders/exceptions/InvalidStatusTransitionError");
const UnexistingItemError = require("../../../../core/orders/exceptions/UnexistingItemError");

context("Order", () => {
  describe("validations", () => {
    it("should create an order with the correct properties", function () {
      const order = new Order({
        id: "1",
        code: "CODE123",
        status: OrderStatus.CREATED,
        totalPrice: 100.0
      });

      expect(order.getId()).to.be.equals("1");
      expect(order.getCode()).to.be.equals("CODE123");
      expect(order.getStatus()).to.be.equals(OrderStatus.CREATED);
      expect(order.getTotalPrice()).to.be.equals(100.0);
      expect(order.getItems()).to.be.empty;
    });
  });
  describe("setStatus", () => {
    it("should allow to create an Order with status `CREATED`", () => {
      expect(
        () =>
          new Order({
            id: "1",
            code: "CODE123",
            status: OrderStatus.CREATED,
            totalPrice: 100.0
          })
      ).to.not.throw(InvalidStatusTransitionError);
    });
    it("should allow to change from status `CREATED` to `PENDING_PAYMENT`", () => {
      const order = new Order({
        id: "1",
        code: "CODE123",
        status: OrderStatus.CREATED,
        totalPrice: 100.0
      });
      expect(() => order.setStatus(OrderStatus.PENDING_PAYMENT)).to.not.throw(
        InvalidStatusTransitionError
      );
    });
    it("should allow to change from status `PENDING_PAYMENT` to `CREATED`", () => {
      const order = new Order({
        id: "1",
        code: "CODE123",
        status: OrderStatus.CREATED,
        totalPrice: 100.0
      });
      order.setStatus(OrderStatus.PENDING_PAYMENT);
      expect(() => order.setStatus(OrderStatus.CREATED)).to.throw(
        InvalidStatusTransitionError
      );
    });
  });
  describe("addItem", () => {
    it("should add item to order", () => {
      const order = new Order({
        id: "1",
        code: "CODE123",
        status: OrderStatus.CREATED,
        totalPrice: 100.0
      });
      const item = {
        id: "item1",
        productId: 1,
        productName: "Hamburguer",
        productDescription: "Normal Hamburguer",
        unitPrice: 12.99,
        quantity: 1
      };
      order.addItem(item);
      expect(order.getItems().length).to.be.at.least(1);
    });
  });
  describe("updateItem", () => {
    it("should update an item", () => {
      const order = new Order({
        id: 1,
        code: "CODE123",
        status: OrderStatus.CREATED,
        totalPrice: 100.0,
        items: [
          {
            id: "item1",
            productId: 1,
            productName: "Hamburguer",
            productDescription: "Normal Hamburguer",
            unitPrice: 12.99,
            quantity: 1
          }
        ]
      });

      const updateValues = {
        quantity: 2
      };

      const updatedItem = order.updateItem("item1", updateValues);
      expect(updatedItem.getQuantity()).to.be.equals(2);
      expect(updatedItem.getTotalPrice()).to.be.equals(
        updateValues.quantity * updatedItem.getUnitPrice()
      );
    });
    it("should throw an error when updating unexisting item", () => {
      const order = new Order({
        id: 1,
        code: "CODE123",
        status: OrderStatus.CREATED,
        totalPrice: 100.0,
        items: []
      });

      const unexistingId = -1;
      const updateValues = { quantity: 3 };

      expect(() => order.updateItem(unexistingId, updateValues)).to.throw(
        new UnexistingItemError(unexistingId).message
      );
    });
  });
});
