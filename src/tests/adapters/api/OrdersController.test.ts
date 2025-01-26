import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import request from "supertest";
import sinon from "sinon";
import app from "../../../../src/server";
import SequelizeCustomerDataSource from "../../../external/SequelizeCustomerDataSource";
import SequelizeOrderDataSource from "../../../external/SequelizeOrderDataSource";
import OrderDTO from "../../../core/orders/dto/OrderDTO";
import CustomerDTO from "../../../core/customers/dto/CustomerDTO";
import OrderPresenter from "../../../presenters/OrderPresenters";

chai.use(chaiAsPromised);

describe("OrdersController", () => {
  let findByPropertiesCustomerStub: sinon.SinonStub;
  let createStub: sinon.SinonStub;
  let findByIdStub: sinon.SinonStub;
  let findAllStub: sinon.SinonStub;
  let findOrdersByStatusAndSortByAscDateSub: sinon.SinonStub;
  let updateOrderStub: sinon.SinonStub;
  let createItemStub: sinon.SinonStub;
  let updateItemStub: sinon.SinonStub;
  let removeItemStub: sinon.SinonStub;

  beforeEach(() => {
    findByPropertiesCustomerStub = sinon.stub(SequelizeCustomerDataSource.prototype, "findByProperties");

    createStub = sinon.stub(SequelizeOrderDataSource.prototype, "create");
    findByIdStub = sinon.stub(SequelizeOrderDataSource.prototype, "findById");
    findAllStub = sinon.stub(SequelizeOrderDataSource.prototype, "findAll");
    findOrdersByStatusAndSortByAscDateSub = sinon.stub(SequelizeOrderDataSource.prototype, "findOrdersByStatusAndSortByAscDate");
    //findOrdersByStatusAndSortByAscDate.resolves([]); -- recebe uma string.
    updateOrderStub = sinon.stub(SequelizeOrderDataSource.prototype, "updateOrder");
    //updateOrderStub.resolves(orderDTO) --recebe um orderDTO - usa o findById para retorno
    createItemStub = sinon.stub(SequelizeOrderDataSource.prototype, "createItem");
    //createItemStub.resolves(order) --recebe um orderDTO e um itemDTO
    updateItemStub = sinon.stub(SequelizeOrderDataSource.prototype, "updateItem");
    //updateItemStub.resolves(nada) -- usa o findByPK - recebe um itemId e o itemDTO com as alterações
    removeItemStub = sinon.stub(SequelizeOrderDataSource.prototype, "removeItem");
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

    // POST /orders 500
    it("should return error message when an error occurs to create a new order", async () => {
      findByPropertiesCustomerStub.rejects();
      const res = await request(app).post("/orders").send({ customerId: 1 });

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
    });
  });

  describe("when search orders", () => {
    //get /orders - 200
    it("should show list orders", async () => {});
    //get /orders - 500
    it("should trazer orders apenas com status de recebido, preparando e done", async () => {});
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

  describe("POST /orders/:orderId/checkout", () => {
    // POST /orders/:orderId/checkout 200
    it("should checkout order", async () => {});

    // POST /orders/:orderId/checkout 400
    it("should return error message when order is empty", async () => {});

    // POST /orders/:orderId/checkout 500
    it("should return error message when an error occurs to checkout order", async () => {});
  });

  describe("GET /orders/:orderId/payment_status", () => {
    // GET /orders/:orderId/payment_status 200
    it("should return payment status", async () => {});

    //GET /orders/:orderId/payment_status 404
    it("should return error message when order is not found", async () => {});

    // GET /orders/:orderId/payment_status 500
    it("should return error message when an error occurs to get payment status", async () => {});
  });

  describe("POST /orders/:orderId/status", () => {
    // POST /orders/:orderId/status 200
    it("should update order status", async () => {});

    // POST /orders/:orderId/status 400
    it("should return error message when order is empty", async () => {});

    // POST /orders/:orderId/status 500
    it("should return error message when an error occurs to update order status", async () => {});
  });

  describe("POST /orders/:orderId/items", () => {
    // POST /orders/:orderId/items 201
    it("should add an item", async () => {});

    // POST /orders/:orderId/items 400
    it("should return error message when order is empty", async () => {});

    // POST /orders/:orderId/items 404
    it("should return error message when order is not found", async () => {});

    // POST /orders/:orderId/items 500
    it("should return error message when an error occurs to add an item", async () => {});
  });

  describe("PUT /orders/:orderId/items/:itemId", () => {
    // PUT /orders/:orderId/items/:itemId 200
    it("should update an item", async () => {});

    // PUT /orders/:orderId/items/:itemId 400
    it("should return error message when item is empty", async () => {});

    // PUT /orders/:orderId/items/:itemId 404
    it("should return error message when item is not found", async () => {});

    // PUT /orders/:orderId/items/:itemId 500
    it("should return error message when an error occurs to update an item", async () => {});
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
