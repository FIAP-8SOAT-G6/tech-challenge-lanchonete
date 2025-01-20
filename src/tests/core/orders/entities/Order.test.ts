import { expect } from "chai";

import Order from "../../../../core/orders/entities/Order";
import { OrderStatus } from "../../../../core/orders/entities/OrderStatus";

import InvalidStatusTransitionError from "../../../../core/orders/exceptions/InvalidStatusTransitionError";
import EmptyOrderError from "../../../../core/orders/exceptions/EmptyOrderError";
import ClosedOrderError from "../../../../core/orders/exceptions/ClosedOrderError";
import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";
import { OrderPaymentsStatus } from "../../../../core/orders/entities/OrderPaymentsStatus";
import ForbiddenPaymentStatusChangeError from "../../../../core/orders/exceptions/ForbiddenPaymentStatusChangeError";
import OrderFinishedError from "../../../../core/orders/exceptions/OrderFinishedError";

context("Order", () => {
  function createOrder(customOrder: {} = {}) {
    return new Order({
      id: 1,
      code: "CODE123",
      status: "",
      customerId: 1,
      ...customOrder
    });
  }

  function buildItem(customProps: {} = {}) {
    return {
      id: 1,
      productId: 1,
      quantity: 1,
      unitPrice: 12.99,
      productName: "Hamburguer",
      productDescription: "Classic Hamburguer",
      ...customProps
    };
  }

  function addItem(
    order: Order,
    item: {
      id?: number;
      productId: number;
      quantity: number;
      unitPrice: number;
      totalPrice?: number;
      productName?: string;
      productDescription?: string;
    } = buildItem()
  ) {
    order.addItem({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      productName: item.productName,
      productDescription: item.productDescription
    });
  }

  const { CREATED, PENDING_PAYMENT, PAYED, RECEIVED, PREPARING, DONE, FINISHED } = OrderStatus;

  describe("create", () => {
    it("should create an order with the correct properties", function () {
      const order = createOrder();

      expect(order.getId()).to.be.equals(1);
      expect(order.getCode()).to.be.equals("CODE123");
      expect(order.getStatus()).to.be.equals(CREATED);
      expect(Number(order.getTotalPrice())).to.be.equals(0);
      expect(order.getItems()).to.be.empty;
    });
  });

  describe("update status", () => {
    it("should create an Order with status `CREATED` when status no given", () => {
      expect(() => createOrder()).to.not.throw(InvalidStatusTransitionError);
    });

    it("should allow to change from status `CREATED` to `PENDING_PAYMENT` if there are items", () => {
      const order = createOrder();
      addItem(order);
      expect(() => order.setStatus(PENDING_PAYMENT)).to.not.throw(InvalidStatusTransitionError);
    });

    it("should not allow to change from status `CREATED` to `PENDING_PAYMENT` if there are no items", () => {
      const order = createOrder();
      expect(() => order.setStatus(PENDING_PAYMENT)).to.throw(EmptyOrderError);
    });

    it("should not allow to change from status `PENDING_PAYMENT` to `CREATED`", () => {
      const order = createOrder();
      addItem(order);

      order.setStatus(PENDING_PAYMENT);

      expect(() => order.setStatus(CREATED)).to.throw(InvalidStatusTransitionError);
    });

    it("should change status `PENDING_PAYMENT` to `PAYED` when payment is approved", () => {
      const customOrder = { paymentStatus: OrderPaymentsStatus.APPROVED };
      const order = createOrder(customOrder);
      addItem(order);

      order.setStatus(PENDING_PAYMENT);

      expect(() => order.setStatus(PAYED)).to.not.throw(InvalidStatusTransitionError);
    });

    it("should throw an error message on updating order status `PENDING_PAYMENT` to `PAYED` when payment is not approved", () => {
      const customOrder = { paymentStatus: OrderPaymentsStatus.PENDING };
      const order = createOrder(customOrder);
      addItem(order);

      order.setStatus(PENDING_PAYMENT);

      expect(() => order.setStatus(PAYED)).to.throw(ForbiddenPaymentStatusChangeError);
    });

    it("should change status `PAYED` to `RECEIVED`", () => {
      const customOrder = { paymentStatus: OrderPaymentsStatus.APPROVED };
      const order = createOrder(customOrder);
      addItem(order);

      order.setStatus(PENDING_PAYMENT);
      order.setStatus(PAYED);
      expect(() => order.setStatus(RECEIVED)).to.not.throw(InvalidStatusTransitionError);
    });

    it("should change status `RECEIVED` to `PREPARING`", () => {
      const customOrder = { paymentStatus: OrderPaymentsStatus.APPROVED };
      const order = createOrder(customOrder);
      addItem(order);

      order.setStatus(PENDING_PAYMENT);
      order.setStatus(PAYED);
      order.setStatus(RECEIVED);
      expect(() => order.setStatus(PREPARING)).to.not.throw(InvalidStatusTransitionError);
    });

    it("should change status `PREPARING` to `DONE`", () => {
      const customOrder = { paymentStatus: OrderPaymentsStatus.APPROVED };
      const order = createOrder(customOrder);
      addItem(order);

      order.setStatus(PENDING_PAYMENT);
      order.setStatus(PAYED);
      order.setStatus(RECEIVED);
      order.setStatus(PREPARING);
      expect(() => order.setStatus(DONE)).to.not.throw(InvalidStatusTransitionError);
    });

    it("should change status `DONE` to `FINISHED`", () => {
      const customOrder = { paymentStatus: OrderPaymentsStatus.APPROVED };
      const order = createOrder(customOrder);
      addItem(order);

      order.setStatus(PENDING_PAYMENT);
      order.setStatus(PAYED);
      order.setStatus(RECEIVED);
      order.setStatus(PREPARING);
      order.setStatus(DONE);
      expect(() => order.setStatus(FINISHED)).to.not.throw(InvalidStatusTransitionError);
    });

    it("should not change status when status is `FINISHED`", () => {
      const customOrder = { paymentStatus: OrderPaymentsStatus.APPROVED };
      const order = createOrder(customOrder);
      addItem(order);

      order.setStatus(PENDING_PAYMENT);
      order.setStatus(PAYED);
      order.setStatus(RECEIVED);
      order.setStatus(PREPARING);
      order.setStatus(DONE);
      order.setStatus(FINISHED);
      expect(() => order.setStatus(PREPARING)).to.throw(OrderFinishedError);
    });
  });

  describe("add item", () => {
    it("should add an item when order has status `CREATED`", () => {
      const order = createOrder();
      const item = {
        id: 1,
        productId: 1,
        productName: "Hamburguer",
        productDescription: "Normal Hamburguer",
        unitPrice: 12.99,
        quantity: 1
      };
      addItem(order, item);
      expect(order.getItems().length).to.be.at.least(1);
      expect(Number(order.getTotalPrice())).to.be.equals(item.quantity * item.unitPrice);
    });

    it("should throw an error message when add an item when the order has a status other than `CREATED`", () => {
      const customOrder = { status: CREATED, paymentStatus: OrderPaymentsStatus.APPROVED };
      const order = createOrder(customOrder);
      addItem(order);

      order.setStatus(PENDING_PAYMENT);
      order.setStatus(PAYED);

      const item = buildItem();
      expect(() => order.addItem(item)).to.throw(ClosedOrderError);
    });
  });

  describe("update item", () => {
    it("should update an item when order has status `CREATED`", () => {
      const customOrder = { status: CREATED, paymentStatus: OrderPaymentsStatus.APPROVED };
      const order = createOrder(customOrder);
      addItem(order);

      const updateValues = {
        quantity: 2
      };

      const updatedItem = order.updateItem(1, updateValues);
      expect(updatedItem.getQuantity()).to.be.equals(2);
      expect(updatedItem.getTotalPrice()).to.be.equals(updateValues.quantity * updatedItem.getUnitPrice());
      expect(Number(order.getTotalPrice())).to.be.equals(updateValues.quantity * Number(updatedItem.getUnitPrice()));
    });

    it("should throw an error message when update an item when the order has a status other than `CREATED`", () => {
      const customOrder = { status: CREATED, paymentStatus: OrderPaymentsStatus.APPROVED };
      const order = createOrder(customOrder);
      addItem(order);

      order.setStatus(PENDING_PAYMENT);
      order.setStatus(PAYED);

      expect(() => order.updateItem(1, { quantity: 0 })).to.throw(ClosedOrderError);
    });

    it("should throw an error when update a non-existent item", () => {
      const order = createOrder();

      const nonExistingId = -1;
      const updateValues = { quantity: 3 };

      expect(() => order.updateItem(nonExistingId, updateValues)).to.throw(ResourceNotFoundError);
    });
  });

  describe("removeItem", () => {
    it("should remove an item when order has status `CREATED`", () => {
      const order = createOrder();
      const item = buildItem();
      addItem(order, item);

      order.removeItem(item.id);
      expect(order.getItems().length).to.be.equals(0);
    });

    it("should throw an error when remove a non-existent item", () => {
      const order = createOrder();
      const nonExistingId = -1;

      expect(() => order.removeItem(nonExistingId)).to.throw(ResourceNotFoundError);
    });

    it("should throw an error when status is not `CREATED`", () => {
      const customOrder = { status: CREATED, paymentStatus: OrderPaymentsStatus.APPROVED };
      const order = createOrder(customOrder);
      addItem(order);

      order.setStatus(PENDING_PAYMENT);
      order.setStatus(PAYED);

      expect(() => order.removeItem(1)).to.throw(ClosedOrderError);
    });
  });
});
