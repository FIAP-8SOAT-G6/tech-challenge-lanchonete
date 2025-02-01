import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import request from "supertest";
import sinon from "sinon";
import app from "../../../../src/server";
import SequelizeCustomerDataSource from "../../../external/SequelizeCustomerDataSource";
import SequelizeOrderDataSource from "../../../external/SequelizeOrderDataSource";
import SequelizeProductDataSource from "../../../external/SequelizeProductDataSource";
import OrderDTO from "../../../core/orders/dto/OrderDTO";
import CustomerDTO from "../../../core/customers/dto/CustomerDTO";
import OrderPresenter from "../../../presenters/OrderPresenters";
import ProductDTO from "../../../core/products/dto/ProductDTO";
import ResourceNotFoundError from "../../../core/common/exceptions/ResourceNotFoundError";

chai.use(chaiAsPromised);

describe("OrdersController", () => {
  let findByPropertiesCustomerStub: sinon.SinonStub;

  let createStub: sinon.SinonStub;
  let findByIdStub: sinon.SinonStub;
  let findAllStub: sinon.SinonStub;
  let findOrdersByStatusAndSortByAscDateStub: sinon.SinonStub;
  let updateOrderStub: sinon.SinonStub;
  let createItemStub: sinon.SinonStub;
  let updateItemStub: sinon.SinonStub;
  let removeItemStub: sinon.SinonStub;

  let findByIdProductStub: sinon.SinonStub;

  beforeEach(() => {
    findByPropertiesCustomerStub = sinon.stub(SequelizeCustomerDataSource.prototype, "findByProperties");

    createStub = sinon.stub(SequelizeOrderDataSource.prototype, "create");
    findByIdStub = sinon.stub(SequelizeOrderDataSource.prototype, "findById");
    findAllStub = sinon.stub(SequelizeOrderDataSource.prototype, "findAll");
    findOrdersByStatusAndSortByAscDateStub = sinon.stub(SequelizeOrderDataSource.prototype, "findOrdersByStatusAndSortByAscDate");
    updateOrderStub = sinon.stub(SequelizeOrderDataSource.prototype, "updateOrder");
    createItemStub = sinon.stub(SequelizeOrderDataSource.prototype, "createItem");
    updateItemStub = sinon.stub(SequelizeOrderDataSource.prototype, "updateItem");
    removeItemStub = sinon.stub(SequelizeOrderDataSource.prototype, "removeItem");
    findByIdProductStub = sinon.stub(SequelizeProductDataSource.prototype, "findById");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("when create order", () => {
    it("should create a new order", async () => {
      const customerDTO = new CustomerDTO({ id: 1, name: "Bob", cpf: "12345678909", email: "test@mail.com" });
      findByPropertiesCustomerStub.resolves([customerDTO]);

      const newOrder = { code: "1", customerId: 1, status: "CREATED" };
      const newOrderDTO = new OrderDTO(newOrder);
      const date = new Date();
      const orderCreated = { ...newOrderDTO, id: 1, createdAt: date, totalPrice: 0, paymentStatus: "PENDING", items: [] };
      createStub.resolves(orderCreated);

      const orderAdapter = OrderPresenter.adaptOrderData(orderCreated);
      const res = await request(app).post("/orders").send({ customerId: 1 });

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal({ ...orderAdapter, createdAt: date.toISOString() });
      expect(findByPropertiesCustomerStub.calledOnce).to.be.true;
      expect(findByPropertiesCustomerStub.calledOnceWith({ id: 1 })).to.be.true;
      expect(createStub.calledOnce).to.be.true;
      expect(createStub.calledOnceWith(newOrderDTO));
    });

    it("should return error message when an error occurs to create a new order", async () => {
      findByPropertiesCustomerStub.resolves([{ id: 1 }]);
      createStub.rejects();
      const res = await request(app).post("/orders").send({ customerId: 1 });

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
    });
  });

  describe("when search orders", () => {
    it("should return orders list", async () => {
      findOrdersByStatusAndSortByAscDateStub.withArgs("DONE").resolves([{ id: 1, status: "DONE" }]);
      findOrdersByStatusAndSortByAscDateStub.withArgs("PREPARING").resolves([]);
      findOrdersByStatusAndSortByAscDateStub.withArgs("RECEIVED").resolves([{ id: 2, status: "RECEIVED" }]);

      const res = await request(app).get("/orders");

      expect(res.status).to.equal(200);
      expect(res.body.length).to.equal(2);
      expect(findOrdersByStatusAndSortByAscDateStub.calledThrice).to.be.true;
    });

    it("should return error message when an error occurs to search the orders list", async () => {
      findOrdersByStatusAndSortByAscDateStub.rejects();
      const res = await request(app).get("/orders");

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
    });
  });

  describe("when search all orders", () => {
    it("should return search all orders", async () => {
      const date = new Date();
      const firstOrderDTO = new OrderDTO({
        id: 1,
        code: "1",
        customerId: 1,
        status: "CREATED",
        paymentStatus: "PENDING",
        totalPrice: 0,
        items: [],
        createdAt: date
      });
      const secondOrderDTO = new OrderDTO({
        id: 2,
        code: "2",
        customerId: 1,
        status: "CREATED",
        paymentStatus: "PENDING",
        totalPrice: 0,
        items: [],
        createdAt: date
      });
      findAllStub.resolves([firstOrderDTO, secondOrderDTO]);

      const firstOrderAdapter = OrderPresenter.adaptOrderData(firstOrderDTO);
      const secondOrderAdapter = OrderPresenter.adaptOrderData(secondOrderDTO);
      const res = await request(app).get("/orders/all");

      expect(res.status).to.equal(200);
      expect(res.body.length).to.equal(2);
      expect(res.body).to.deep.equal([
        { ...firstOrderAdapter, createdAt: date.toISOString() },
        { ...secondOrderAdapter, createdAt: date.toISOString() }
      ]);
      expect(findAllStub.calledOnce).to.be.true;
    });

    it("should return error message when an error occurs to search the orders list", async () => {
      findAllStub.rejects();
      const res = await request(app).get("/orders/all");

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
    });
  });

  describe("when search order by id", () => {
    it("should search order by id", async () => {
      const date = new Date();
      const orderDTO = new OrderDTO({
        id: 1,
        code: "1",
        customerId: 1,
        status: "CREATED",
        paymentStatus: "PENDING",
        totalPrice: 0,
        items: [],
        createdAt: date
      });
      findByIdStub.resolves(orderDTO);

      const orderAdapter = OrderPresenter.adaptOrderData(orderDTO);
      const res = await request(app).get("/orders/1");

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal({ ...orderAdapter, createdAt: date.toISOString() });
      expect(findByIdStub.calledOnce).to.be.true;
      expect(findByIdStub.calledOnceWith(1)).to.be.true;
    });

    it("should return error message when order is not found", async () => {
      findByIdStub.resolves(undefined);
      const res = await request(app).get("/orders/1");

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({ error: "Order not found for id '1'" });
    });

    it("should return error message when an error occurs to search the order", async () => {
      findByIdStub.rejects();
      const res = await request(app).get("/orders/1");

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
    });
  });

  describe("when search status payment", () => {
    it("should return payment status", async () => {
      findByIdStub.resolves({ id: 1, paymentStatus: "PENDING" });
      const res = await request(app).get("/orders/1/payment_status");

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal("PENDING");
      expect(findByIdStub.calledOnce).to.be.true;
      expect(findByIdStub.calledOnceWith(1)).to.be.true;
    });

    it("should return error message when order is not found", async () => {
      findByIdStub.resolves();
      const res = await request(app).get("/orders/1/payment_status");

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({ error: "Order not found for id '1'" });
    });

    it("should return error message when an error occurs to get payment status", async () => {
      findByIdStub.rejects();

      const res = await request(app).get("/orders/1/payment_status");

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
    });
  });

  describe("when update status", () => {
    it("should update order status", async () => {
      findByIdStub.resolves({ id: 1, status: "CREATED", items: [{ id: 1, quantity: 2 }] });
      updateOrderStub.resolves({ id: 1, status: "PENDING_PAYMENT" });

      const res = await request(app).post("/orders/1/status").send({ status: "PENDING_PAYMENT" });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ id: 1, status: "PENDING_PAYMENT" });
      expect(updateOrderStub.calledOnce).to.be.true;
      expect(updateOrderStub.calledOnceWith({ id: 1, status: "PENDING_PAYMENT" }));
    });

    it("should return error message when order is empty", async () => {
      findByIdStub.resolves({ id: 1, status: "CREATED" });
      updateOrderStub.resolves({ id: 1, status: "PENDING_PAYMENT" });

      const res = await request(app).post("/orders/1/status").send({ status: "PENDING_PAYMENT" });

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({ error: "Cannot checkout empty order." });
    });

    it("should return error message when an error occurs to update order status", async () => {
      findByIdStub.resolves({ id: 1, status: "CREATED", items: [{ id: 1, quantity: 2 }] });
      updateOrderStub.rejects();

      const res = await request(app).post("/orders/1/status").send({ status: "PENDING_PAYMENT" });

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
    });
  });

  describe("POST /orders/:orderId/items", () => {
    it("should add an item", async () => {
      const product = { id: 5, name: "Product", description: "Product description", price: 10 };
      const productDTO = new ProductDTO(product);
      findByIdProductStub.resolves(productDTO);

      const orderId = 1;
      const productId = 5;
      const date = new Date();
      const orderDTO = new OrderDTO({
        id: orderId,
        code: "1",
        customerId: 1,
        status: "CREATED",
        paymentStatus: "PENDING",
        totalPrice: 0,
        items: [],
        createdAt: date
      });
      findByIdStub.resolves(orderDTO);

      const item = { productId, quantity: 2 };

      createItemStub.resolves();
      const orderWithItem = {
        ...orderDTO,
        totalPrice: 20,
        items: [{ ...item, orderId: 1, id: 1, productName: product.name, productDescription: product.description, totalPrice: 20, unitPrice: 10 }]
      };
      findByIdStub.resolves(orderWithItem);

      const orderAdapt = OrderPresenter.adaptOrderData(orderWithItem);

      const res = await request(app).post("/orders/1/items").send(item);

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal({ ...orderAdapt, createdAt: date.toISOString() });
      expect(createItemStub.calledOnce).to.be.true;
      expect(createItemStub.calledOnceWith(orderId, productId));
    });

    it("should return error message when order is closed", async () => {
      const product = { id: 5, name: "Product", description: "Product description", price: 10 };
      const productDTO = new ProductDTO(product);
      findByIdProductStub.resolves(productDTO);

      const orderDTO = new OrderDTO({
        id: 1,
        code: "1",
        customerId: 1,
        status: "FINISHED",
        paymentStatus: "APPROVED",
        totalPrice: 20,
        items: [{ id: 1, productId: 1, quantity: 2, unitPrice: 10, totalPrice: 20 }],
        createdAt: new Date()
      });
      findByIdStub.resolves(orderDTO);

      const res = await request(app).post("/orders/1/items").send({ productId: 1, quantity: 2 });

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({ error: "Cannot modify order '1' with status 'FINISHED'." });
    });

    it("should return error message when order is not found", async () => {
      findByIdStub.resolves(undefined);

      const res = await request(app).post("/orders/1/items").send({ productId: 1, quantity: 2 });

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({ error: "Order not found for id '1'" });
    });

    it("should return error message when an error occurs to add an item", async () => {
      const product = { id: 5, name: "Product", description: "Product description", price: 10 };
      const productDTO = new ProductDTO(product);
      findByIdProductStub.resolves(productDTO);

      const orderDTO = new OrderDTO({
        id: 1,
        code: "1",
        customerId: 1,
        status: "CREATED",
        paymentStatus: "PENDING",
        totalPrice: 20,
        items: [{ id: 1, productId: 1, quantity: 2, unitPrice: 10, totalPrice: 20 }],
        createdAt: new Date()
      });
      findByIdStub.resolves(orderDTO);

      createItemStub.rejects();

      const res = await request(app).post("/orders/1/items").send({ productId: 1, quantity: 2 });

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
    });
  });

  describe("PUT /orders/:orderId/items/:itemId", () => {
    it("should update an item", async () => {
      const product = { id: 5, name: "Product", description: "Product description", price: 10 };
      const productDTO = new ProductDTO(product);
      findByIdProductStub.resolves(productDTO);

      const orderId = 1;
      const productId = 5;
      const date = new Date();
      const orderDTO = new OrderDTO({
        id: 1,
        code: "1",
        customerId: 1,
        status: "CREATED",
        paymentStatus: "PENDING",
        totalPrice: 20,
        items: [{ id: 1, productId: 1, quantity: 2, unitPrice: 10, totalPrice: 20 }],
        createdAt: new Date()
      });
      findByIdStub.resolves(orderDTO);

      const item = { productId, quantity: 4, description: "New description" };

      updateItemStub.resolves();
      const orderWithItem = {
        ...orderDTO,
        totalPrice: 40,
        items: [{ ...item, orderId: 1, id: 1, productName: product.name, productDescription: product.description, totalPrice: 40, unitPrice: 10 }]
      };
      findByIdStub.resolves(orderWithItem);

      const orderAdapt = OrderPresenter.adaptOrderData(orderWithItem);

      const res = await request(app).put("/orders/1/items/1").send(item);

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ ...orderAdapt, createdAt: date.toISOString() });
      expect(updateItemStub.calledOnce).to.be.true;
      expect(
        updateItemStub.calledOnceWith(
          orderId,
          sinon.match({
            id: 1,
            orderId: 1,
            productId: 5,
            productName: "Product",
            productDescription: "Product description",
            quantity: 4,
            unitPrice: 10,
            totalPrice: 40
          })
        )
      ).to.be.true;
    });

    it("should return error message when item is closed", async () => {
      const orderDTO = new OrderDTO({
        id: 1,
        code: "1",
        customerId: 1,
        status: "FINISHED",
        paymentStatus: "APPROVED",
        totalPrice: 20,
        items: [{ id: 1, productId: 1, quantity: 2, unitPrice: 10, totalPrice: 20 }],
        createdAt: new Date()
      });

      findByIdStub.resolves(orderDTO);

      const res = await request(app).put("/orders/1/items/1").send({ productId: 1, quantity: 2 });

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({ error: "Cannot modify order '1' with status 'FINISHED'." });
    });

    it("should return error message when product is not found", async () => {
      findByIdProductStub.resolves(undefined);

      const orderDTO = new OrderDTO({
        id: 1,
        code: "1",
        customerId: 1,
        status: "CREATED",
        paymentStatus: "PENDING",
        totalPrice: 20,
        items: [{ id: 1, productId: 1, quantity: 2, unitPrice: 10, totalPrice: 20 }],
        createdAt: new Date()
      });

      findByIdStub.resolves(orderDTO);

      const res = await request(app).put("/orders/1/items/2").send({ productId: 1, quantity: 2 });

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({ error: new ResourceNotFoundError("Item", "id", 2).message });
    });

    it("should return error message when an error occurs to update an item", async () => {
      findByIdProductStub.resolves([{ id: 1, name: "Product", description: "Product description", price: 10 }]);

      const orderDTO = new OrderDTO({
        id: 1,
        code: "1",
        customerId: 1,
        status: "CREATED",
        paymentStatus: "PENDING",
        totalPrice: 20,
        items: [{ id: 1, productId: 1, quantity: 2, unitPrice: 10, totalPrice: 20 }],
        createdAt: new Date()
      });

      findByIdStub.resolves(orderDTO);
      updateItemStub.rejects();

      const res = await request(app).put("/orders/1/items/1").send({ productId: 1, quantity: 2 });

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
    });
  });

  describe("when remove item in order", () => {
    it("should remove an item", async () => {
      findByIdStub.resolves({ id: 1, items: [{ id: 1, quantity: 2 }] });
      removeItemStub.resolves();
      const res = await request(app).delete("/orders/1/items/1");

      expect(res.status).to.equal(204);
      expect(res.body).to.deep.equal({});
      expect(removeItemStub.calledOnce).to.be.true;
      expect(removeItemStub.calledOnceWith(1, 1)).to.be.true;
    });

    it("should return error message when order is closed", async () => {
      findByIdStub.resolves({ id: 1, status: "FINISHED" });

      const res = await request(app).delete("/orders/1/items/1");

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({ error: "Cannot modify order '1' with status 'FINISHED'." });
    });

    it("should return error message when order is not found", async () => {
      findByIdStub.resolves();

      const res = await request(app).delete("/orders/1/items/1");

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({ error: "Order not found for id '1'" });
    });

    it("should return error message when item is not found", async () => {
      findByIdStub.resolves({ id: 1 });

      const res = await request(app).delete("/orders/1/items/1");

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({ error: "Item not found for id '1'" });
    });

    it("should return error message when an error occurs to remove an item", async () => {
      findByIdStub.resolves({ id: 1, items: [{ id: 1, quantity: 2 }] });
      removeItemStub.rejects();

      const res = await request(app).delete("/orders/1/items/1");

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
    });
  });

  describe("when invalid route", () => {
    it("should return error message of Route not found when route is invalid", async () => {
      const res = await request(app).get("/invalid/");

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({ error: "Route not found" });
    });
  });
});
