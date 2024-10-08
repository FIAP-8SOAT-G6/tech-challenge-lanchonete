import { expect } from "chai";

import Order from "../../../../core/orders/entities/Order";
import { OrderStatus } from "../../../../core/orders/entities/OrderStatus";

import InvalidStatusTransitionError from "../../../../core/orders/exceptions/InvalidStatusTransitionError";
import EmptyOrderError from "../../../../core/orders/exceptions/EmptyOrderError";
import ClosedOrderError from "../../../../core/orders/exceptions/ClosedOrderError";
import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";

context("Order", () => {
  describe("validations", () => {
    it("should create an order with the correct properties", function () {
      const order = new Order({
        id: 1,
        code: "CODE123",
        status: OrderStatus.CREATED,
        customerId: 1
      });

      expect(order.getId()).to.be.equals(1);
      expect(order.getCode()).to.be.equals("CODE123");
      expect(order.getStatus()).to.be.equals(OrderStatus.CREATED);
      expect(Number(order.getTotalPrice())).to.be.equals(0);
      expect(order.getItems()).to.be.empty;
    });
  });
  describe("setStatus", () => {
    it("should allow to create an Order with status `CREATED`", () => {
      expect(
        () =>
          new Order({
            id: 1,
            code: "CODE123",
            status: OrderStatus.CREATED,
            customerId: 1
          })
      ).to.not.throw(InvalidStatusTransitionError);
    });
    it("should allow to change from status `CREATED` to `PENDING_PAYMENT` if there are items", () => {
      const order = new Order({
        id: 1,
        code: "CODE123",
        status: OrderStatus.CREATED,
        totalPrice: 100.0,
        customerId: 1
      });
      order.addItem({
        id: 1,
        productId: 1,
        quantity: 1,
        unitPrice: 12.99,
        productName: "Hamburguer",
        productDescription: "Classic Hamburguer"
      });
      expect(() => order.setStatus(OrderStatus.PENDING_PAYMENT)).to.not.throw(InvalidStatusTransitionError);
    });
    it("should not allow to change from status `CREATED` to `PENDING_PAYMENT` if there are no items", () => {
      const order = new Order({
        id: 1,
        code: "CODE123",
        status: OrderStatus.CREATED,
        totalPrice: 100,
        customerId: 10
      });
      expect(() => order.setStatus(OrderStatus.PENDING_PAYMENT)).to.throw(EmptyOrderError);
    });
    it("should not allow to change from status `PENDING_PAYMENT` to `CREATED`", () => {
      const order = new Order({
        id: 1,
        code: "CODE123",
        status: OrderStatus.CREATED,
        totalPrice: 100,
        customerId: 10
      });
      order.addItem({
        id: 1,
        productId: 1,
        quantity: 1,
        unitPrice: 12.99,
        productName: "Hamburguer",
        productDescription: "Classic Hamburguer"
      });
      order.setStatus(OrderStatus.PENDING_PAYMENT);
      expect(() => order.setStatus(OrderStatus.CREATED)).to.throw(InvalidStatusTransitionError);
    });
  });
  describe("addItem", () => {
    it("should add item to order", () => {
      const order = new Order({
        id: 1,
        code: "CODE123",
        status: OrderStatus.CREATED,
        totalPrice: 100.0,
        customerId: 1
      });
      const item = {
        id: 1,
        productId: 1,
        productName: "Hamburguer",
        productDescription: "Normal Hamburguer",
        unitPrice: 12.99,
        quantity: 1
      };
      order.addItem(item);
      expect(order.getItems().length).to.be.at.least(1);
      expect(Number(order.getTotalPrice())).to.be.equals(item.quantity * item.unitPrice);
    });
    it("should throw an error when status is not `CREATED`", () => {
      const order = new Order({
        id: 1,
        code: "CODE123",
        status: OrderStatus.PAYED,
        totalPrice: 100.0,
        customerId: 1,
        items: [
          {
            id: 1,
            productId: 1,
            productName: "Hamburguer",
            productDescription: "Normal Hamburguer",
            unitPrice: 12.99,
            quantity: 1
          }
        ]
      });
      expect(() =>
        order.addItem({
          id: 2,
          productId: 1,
          quantity: 3,
          unitPrice: 12.99,
          productName: "Hamburguer",
          productDescription: "Classic Hamburguer"
        })
      ).to.throw(ClosedOrderError);
    });
  });
  describe("updateItem", () => {
    it("should update an item if status is `CREATED`", () => {
      const order = new Order({
        id: 1,
        code: "CODE123",
        status: OrderStatus.CREATED,
        totalPrice: 100.0,
        customerId: 1,
        items: [
          {
            id: 1,
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

      const updatedItem = order.updateItem(1, updateValues);
      expect(updatedItem.getQuantity()).to.be.equals(2);
      expect(updatedItem.getTotalPrice()).to.be.equals(updateValues.quantity * updatedItem.getUnitPrice());
      expect(Number(order.getTotalPrice())).to.be.equals(updateValues.quantity * Number(updatedItem.getUnitPrice()));
    });
    it("should throw an error when updating unexisting item", () => {
      const order = new Order({
        id: 1,
        code: "CODE123",
        status: OrderStatus.CREATED,
        totalPrice: 100.0,
        items: [],
        customerId: 1
      });

      const unexistingId = -1;
      const updateValues = { quantity: 3 };

      expect(() => order.updateItem(unexistingId, updateValues)).to.throw(ResourceNotFoundError);
    });
    it("should throw an error when status is not `CREATED`", () => {
      const order = new Order({
        id: 1,
        code: "CODE123",
        status: OrderStatus.PAYED,
        totalPrice: 100.0,
        items: [
          {
            id: 1,
            productId: 1,
            productName: "Hamburguer",
            productDescription: "Normal Hamburguer",
            unitPrice: 12.99,
            quantity: 1
          }
        ],
        customerId: 1
      });
      expect(() => order.updateItem(1, { quantity: 0 })).to.throw(ClosedOrderError);
    });
  });
  describe("removeItem", () => {
    it("should remove an item if status is `CREATED`", () => {
      const order = new Order({
        id: 1,
        code: "CODE123",
        status: OrderStatus.CREATED,
        totalPrice: 100.0,
        items: [
          {
            id: 1,
            productId: 1,
            productName: "Hamburguer",
            productDescription: "Normal Hamburguer",
            unitPrice: 12.99,
            quantity: 1
          }
        ],
        customerId: 1
      });

      order.removeItem(1);
      expect(order.getItems().length).to.be.equals(0);
    });
    it("should throw an error when removing unexisting item", () => {
      const order = new Order({
        id: 1,
        code: "CODE123",
        status: OrderStatus.CREATED,
        totalPrice: 100.0,
        items: [],
        customerId: 1
      });

      const unexistingId = -1;

      expect(() => order.removeItem(unexistingId)).to.throw(ResourceNotFoundError);
    });
    it("should throw an error when status is not `CREATED`", () => {
      const order = new Order({
        id: 1,
        code: "CODE123",
        status: OrderStatus.PAYED,
        totalPrice: 100.0,
        items: [
          {
            id: 1,
            productId: 1,
            productName: "Hamburguer",
            productDescription: "Normal Hamburguer",
            unitPrice: 12.99,
            quantity: 1
          }
        ],
        customerId: 1
      });
      expect(() => order.removeItem(1)).to.throw(ClosedOrderError);
    });
  });
});
