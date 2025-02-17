import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import request from "supertest";
import sinon from "sinon";
import app from "../../../server";
import SequelizeOrderDataSource from "../../../external/SequelizeOrderDataSource";
import OrderDTO from "../../../core/orders/dto/OrderDTO";
import CustomerDTO from "../../../core/customers/dto/CustomerDTO";
import OrderPresenter from "../../../presenters/OrderPresenters";
import CustomersService from "../../../external/CustomersService";
import ProductDTO from "../../../core/products/dto/ProductDTO";
import ProductsService from "../../../external/ProductsService";
import ItemDTO from "../../../core/orders/dto/ItemDTO";
import EmptyOrderError from "../../../core/orders/exceptions/EmptyOrderError";
import ResourceNotFoundError from "../../../core/common/exceptions/ResourceNotFoundError";
import { OrderStatus } from "../../../core/orders/entities/OrderStatus";
import { MercadoPagoPaymentSystem } from "../../../external/MercadoPagoPaymentSystem";

chai.use(chaiAsPromised);

describe("OrdersAPI", () => {
  let findByIDCustomerStub: sinon.SinonStub;
  let findByCPFCustomerStub: sinon.SinonStub;
  let findByIdProductStub: sinon.SinonStub;
  let sendPaymentRequest: sinon.SinonStub;
  let createStub: sinon.SinonStub;
  let findByIdStub: sinon.SinonStub;
  let findAllStub: sinon.SinonStub;
  let findOrdersByStatusAndSortByAscDateStub: sinon.SinonStub;
  let updateOrderStub: sinon.SinonStub;
  let createItemStub: sinon.SinonStub;
  let updateItemStub: sinon.SinonStub;
  let removeItemStub: sinon.SinonStub;

  beforeEach(() => {
    findByIDCustomerStub = sinon.stub(CustomersService.prototype, "findByID");
    findByCPFCustomerStub = sinon.stub(CustomersService.prototype, "findByCPF");
    findByIdProductStub = sinon.stub(ProductsService.prototype, "findById");
    sendPaymentRequest = sinon.stub(
      MercadoPagoPaymentSystem.prototype,
      "sendPaymentRequest"
    );

    createStub = sinon.stub(SequelizeOrderDataSource.prototype, "create");
    findByIdStub = sinon.stub(SequelizeOrderDataSource.prototype, "findById");
    findAllStub = sinon.stub(SequelizeOrderDataSource.prototype, "findAll");
    findOrdersByStatusAndSortByAscDateStub = sinon.stub(
      SequelizeOrderDataSource.prototype,
      "findOrdersByStatusAndSortByAscDate"
    );
    //findOrdersByStatusAndSortByAscDate.resolves([]); -- recebe uma string.
    updateOrderStub = sinon.stub(
      SequelizeOrderDataSource.prototype,
      "updateOrder"
    );
    //updateOrderStub.resolves(orderDTO) --recebe um orderDTO - usa o findById para retorno
    createItemStub = sinon.stub(
      SequelizeOrderDataSource.prototype,
      "createItem"
    );
    //createItemStub.resolves(order) --recebe um orderDTO e um itemDTO
    updateItemStub = sinon.stub(
      SequelizeOrderDataSource.prototype,
      "updateItem"
    );
    //updateItemStub.resolves(nada) -- usa o findByPK - recebe um itemId e o itemDTO com as alterações
    removeItemStub = sinon.stub(
      SequelizeOrderDataSource.prototype,
      "removeItem"
    );
  });

  function resolvesFindCustomer() {
    const customerDTO = new CustomerDTO({
      id: 1,
      name: "Bob",
      cpf: "12345678909",
      email: "test@mail.com",
    });
    findByIDCustomerStub.resolves(customerDTO);
    return customerDTO;
  }

  function createOrderDTO(customProps: {} = {}) {
    const newOrder = {
      id: 1,
      code: "1",
      customerId: 1,
      status: "CREATED",
      totalPrice: 0,
      items: [],
      ...customProps,
    };
    return new OrderDTO(newOrder);
  }

  function adaptOrderToJson(orderCreated: OrderDTO) {
    const order = OrderPresenter.adaptOrderData(orderCreated);
    const orderJSon = JSON.stringify({
      ...order,
      createdAt: order.createdAt.toISOString(),
    });
    return JSON.parse(orderJSon);
  }

  function resolvesCreateProduct() {
    const product = {
      id: 5,
      name: "Product",
      description: "Product description",
      price: 10,
    };
    const productDTO = new ProductDTO(product);
    findByIdProductStub.resolves(productDTO);

    return productDTO;
  }

  function resolvesFindOrder({
    customOrder,
    customItems,
  }: { customOrder?: Partial<OrderDTO>; customItems?: Partial<ItemDTO> } = {}) {
    const itemDTO = new ItemDTO({
      id: 1,
      quantity: 2,
      totalPrice: 10,
      unitPrice: 5,
      ...customItems,
    });
    const orderDTO = createOrderDTO({
      id: 1,
      code: "1",
      createdAt: new Date(),
      items: [itemDTO],
      ...customOrder,
    });
    findByIdStub.resolves(orderDTO);
    return orderDTO;
  }

  afterEach(() => {
    sinon.restore();
  });

  describe("when create order", () => {
    it("should create a new order", async () => {
      const customerDTO = resolvesFindCustomer();

      const newOrderDTO = createOrderDTO({
        items: [],
        paymentStatus: "PENDING",
      });
      const orderCreated = {
        ...newOrderDTO,
        id: 1,
        createdAt: new Date(),
        totalPrice: 0,
        items: [],
      };
      createStub.resolves(orderCreated);

      const orderAdapter = adaptOrderToJson(orderCreated);
      const res = await request(app).post("/orders").send({ customerId: 1 });

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal(orderAdapter);
      expect(findByIDCustomerStub.calledOnce).to.be.true;
      expect(findByIDCustomerStub.calledOnceWith(customerDTO.id)).to.be.true;
      expect(createStub.calledOnce).to.be.true;
    });

    it("should return message error when missing required fields", async () => {
      findByIDCustomerStub.resolves(undefined);

      const newOrder = { code: "1", customerId: 1, status: "CREATED" };
      const newOrderDTO = new OrderDTO(newOrder);
      const orderCreated = {
        ...newOrderDTO,
        id: 1,
        createdAt: new Date(),
        totalPrice: 0,
        paymentStatus: "PENDING",
        items: [],
      };
      createStub.resolves(orderCreated);

      const res = await request(app).post("/orders").send({ customerId: 1 });

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        error: "Customer not found for id '1'",
      });
    });

    it("should return error message when an error occurs to create a new order", async () => {
      resolvesFindCustomer();
      createStub.rejects();
      const res = await request(app).post("/orders").send({ customerId: 1 });

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
    });
  });

  describe("when search orders", () => {
    it("should return orders list", async () => {
      findOrdersByStatusAndSortByAscDateStub
        .withArgs("DONE")
        .resolves([createOrderDTO({ id: 1, status: "DONE" })]);
      findOrdersByStatusAndSortByAscDateStub.withArgs("PREPARING").resolves([]);
      findOrdersByStatusAndSortByAscDateStub
        .withArgs("RECEIVED")
        .resolves([createOrderDTO({ id: 2, status: "RECEIVED" })]);

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
      const firstCreatedOrderDTO = createOrderDTO({
        id: 1,
        code: "1",
        paymentStatus: "PENDING",
        createdAt: new Date(),
      });
      const secondCreatedOrderDTO = createOrderDTO({
        id: 2,
        code: "2",
        paymentStatus: "PENDING",
        createdAt: new Date(),
      });
      findAllStub.resolves([firstCreatedOrderDTO, secondCreatedOrderDTO]);

      const firstOrderAdapter =
        OrderPresenter.adaptOrderData(firstCreatedOrderDTO);
      const secondOrderAdapter = OrderPresenter.adaptOrderData(
        secondCreatedOrderDTO
      );
      const res = await request(app).get("/orders/all");

      expect(res.status).to.equal(200);
      expect(res.body.length).to.equal(2);
      expect(res.body).to.deep.equal([
        {
          ...firstOrderAdapter,
          createdAt: firstOrderAdapter.createdAt.toISOString(),
        },
        {
          ...secondOrderAdapter,
          createdAt: secondOrderAdapter.createdAt.toISOString(),
        },
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
      const orderDTO = createOrderDTO({
        paymentStatus: "PENDING",
        createdAt: new Date(),
      });
      findByIdStub.resolves(orderDTO);

      const orderAdapter = OrderPresenter.adaptOrderData(orderDTO);
      const res = await request(app).get("/orders/1");

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal({
        ...orderAdapter,
        createdAt: orderAdapter.createdAt.toISOString(),
      });
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
      const orderDTO = createOrderDTO({ paymentStatus: "APPROVED" });
      findByIdStub.resolves(orderDTO);
      const res = await request(app).get("/orders/1/payment_status");

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal("APPROVED");
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
      const itemDTO = new ItemDTO({
        id: 1,
        quantity: 2,
        totalPrice: 10,
        unitPrice: 5,
      });
      const orderDTO = createOrderDTO({
        id: 1,
        code: "1",
        createdAt: new Date(),
        items: [itemDTO],
      });
      findByIdStub.resolves(orderDTO);
      const orderUpdated = { ...orderDTO, status: "PENDING_PAYMENT" };
      updateOrderStub.resolves(orderUpdated);

      const res = await request(app)
        .post("/orders/1/status")
        .send({ status: "PENDING_PAYMENT" });

      const orderAdapter = adaptOrderToJson({
        ...orderDTO,
        status: "PENDING_PAYMENT",
      });
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equals(orderAdapter);
      expect(updateOrderStub.calledOnce).to.be.true;
    });

    it("should return error message when order is empty", async () => {
      const orderDTO = createOrderDTO({ paymentStatus: "PENDING" });
      findByIdStub.resolves(orderDTO);
      updateOrderStub.resolves({ ...orderDTO, status: "PENDING_PAYMENT" });

      const res = await request(app)
        .post("/orders/1/status")
        .send({ status: "PENDING_PAYMENT" });

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({ error: new EmptyOrderError().message });
    });

    it("should return error message when an error occurs to update order status", async () => {
      const orderDTO = createOrderDTO({
        paymentStatus: "PENDING",
        items: [{ id: 1, quantity: 2 }],
      });
      findByIdStub.resolves(orderDTO);
      updateOrderStub.rejects();

      const res = await request(app)
        .post("/orders/1/status")
        .send({ status: "PENDING_PAYMENT" });

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
    });
  });

  describe("POST /orders/:orderId/items", () => {
    it("should add an item", async () => {
      const productCreated = resolvesCreateProduct();

      const orderId = 1;
      const orderDTO = new OrderDTO({
        id: orderId,
        code: "1",
        customerId: 1,
        status: "CREATED",
        paymentStatus: "PENDING",
        totalPrice: 0,
        items: [],
        createdAt: new Date(),
      });
      findByIdStub.resolves(orderDTO);

      const item = { productId: productCreated.id, quantity: 2 };

      createItemStub.resolves();
      const orderWithItem = {
        ...orderDTO,
        totalPrice: 20,
        items: [
          {
            ...item,
            orderId: 1,
            id: 1,
            productName: productCreated.name,
            productDescription: productCreated.description,
            totalPrice: 20,
            unitPrice: 10,
          },
        ],
      };
      findByIdStub.resolves(orderWithItem);

      const res = await request(app).post("/orders/1/items").send(item);

      const orderAdapt = adaptOrderToJson(orderWithItem);
      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal(orderAdapt);
      expect(createItemStub.calledOnce).to.be.true;
      expect(createItemStub.calledOnceWith(orderId, productCreated.id));
    });

    it("should return error message when order is closed", async () => {
      resolvesCreateProduct();
      resolvesFindOrder({
        customOrder: { status: "FINISHED", paymentStatus: "APPROVED" },
      });

      const res = await request(app)
        .post("/orders/1/items")
        .send({ productId: 1, quantity: 2 });

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        error: "Cannot modify order '1' with status 'FINISHED'.",
      });
    });

    it("should return error message when order is not found", async () => {
      findByIdStub.resolves(undefined);

      const res = await request(app)
        .post("/orders/1/items")
        .send({ productId: 1, quantity: 2 });

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({ error: "Order not found for id '1'" });
    });

    it("should return error message when an error occurs to add an item", async () => {
      resolvesCreateProduct();
      resolvesFindOrder();

      createItemStub.rejects();

      const res = await request(app)
        .post("/orders/1/items")
        .send({ productId: 1, quantity: 2 });

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
    });
  });

  describe("PUT /orders/:orderId/items/:itemId", () => {
    it("should update an item", async () => {
      const productCreated = resolvesCreateProduct();

      const orderId = 1;
      const date = new Date();
      const orderDTO = new OrderDTO({
        id: orderId,
        code: "1",
        customerId: 1,
        status: "CREATED",
        paymentStatus: "PENDING",
        totalPrice: 20,
        items: [
          {
            id: 1,
            productId: productCreated.id,
            quantity: 2,
            unitPrice: 10,
            totalPrice: 20,
          },
        ],
        createdAt: new Date(),
      });
      findByIdStub.resolves(orderDTO);

      const item = {
        productId: productCreated.id,
        quantity: 4,
        description: "New description",
      };

      updateItemStub.resolves();
      const orderWithItem = {
        ...orderDTO,
        totalPrice: 40,
        items: [
          {
            ...item,
            orderId: 1,
            id: 1,
            productName: productCreated.name,
            productDescription: productCreated.description,
            totalPrice: 40,
            unitPrice: 10,
          },
        ],
      };
      findByIdStub.resolves(orderWithItem);

      const orderAdapt = OrderPresenter.adaptOrderData(orderWithItem);

      const res = await request(app).put("/orders/1/items/1").send(item);

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        ...orderAdapt,
        createdAt: date.toISOString(),
      });
      expect(updateItemStub.calledOnce).to.be.true;
      expect(
        updateItemStub.calledOnceWith(
          orderId,
          sinon.match({
            id: 1,
            orderId,
            productId: 5,
            productName: "Product",
            productDescription: "Product description",
            quantity: 4,
            unitPrice: 10,
            totalPrice: 40,
          })
        )
      ).to.be.true;
    });

    it("should return error message when item is closed", async () => {
      resolvesFindOrder({
        customOrder: { status: "FINISHED", paymentStatus: "APPROVED" },
      });

      const res = await request(app)
        .put("/orders/1/items/1")
        .send({ productId: 1, quantity: 2 });

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        error: "Cannot modify order '1' with status 'FINISHED'.",
      });
    });

    it("should return error message when product is not found", async () => {
      findByIdProductStub.resolves(undefined);
      const order = resolvesFindOrder();

      const res = await request(app)
        .put(`/orders/${order.id}/items/3444`)
        .send({ productId: 1, quantity: 2 });

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        error: new ResourceNotFoundError("Item", "id", 3444).message,
      });
    });

    it("should return error message when an error occurs to update an item", async () => {
      findByIdProductStub.resolves([
        {
          id: 1,
          name: "Product",
          description: "Product description",
          price: 10,
        },
      ]);
      const order = resolvesFindOrder();

      updateItemStub.rejects();

      const res = await request(app)
        .put(`/orders/${order.id}/items/${order.items![0].id}`)
        .send({ productId: 1, quantity: 2 });

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
    });
  });

  describe("when remove item in order", () => {
    it("should remove an item", async () => {
      const order = resolvesFindOrder();

      removeItemStub.resolves();
      const res = await request(app).delete(
        `/orders/${order.id}/items/${order?.items![0]?.id}`
      );

      expect(res.status).to.equal(204);
      expect(res.body).to.deep.equal({});
      expect(removeItemStub.calledOnce).to.be.true;
      expect(removeItemStub.calledOnceWith(1, 1)).to.be.true;
    });

    it("should return error message when order is closed", async () => {
      resolvesFindOrder({ customOrder: { status: "FINISHED" } });

      const res = await request(app).delete("/orders/1/items/1");

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        error: "Cannot modify order '1' with status 'FINISHED'.",
      });
    });

    it("should return error message when order is not found", async () => {
      findByIdStub.resolves();

      const res = await request(app).delete("/orders/1/items/1");

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({ error: "Order not found for id '1'" });
    });

    it("should return error message when item is not found", async () => {
      resolvesFindOrder();

      const res = await request(app).delete("/orders/1/items/2");

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({ error: "Item not found for id '2'" });
    });

    it("should return error message when an error occurs to remove an item", async () => {
      resolvesFindOrder();
      removeItemStub.rejects();

      const res = await request(app).delete("/orders/1/items/1");

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
    });
  });

  describe("when checking out order", () => {
    it("should checkout order", async () => {
      sendPaymentRequest.resolves("QR_CODE");
      resolvesFindOrder({ customOrder: { status: "CREATED" } });

      const res = await request(app).post("/orders/1/checkout");

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ qrCode: "QR_CODE" });
      expect(updateOrderStub.calledOnce).to.be.true;
      expect(
        updateOrderStub.calledOnceWith(
          sinon.match({
            status: OrderStatus.PENDING_PAYMENT,
          })
        )
      ).to.be.true;
    });

    it("should not checkout empty order", async () => {
      resolvesFindOrder({ customOrder: { items: [] } });

      const res = await request(app).post("/orders/1/checkout");

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({ error: new EmptyOrderError().message });
    });

    it("should throw an error if order does not exist", async () => {
      findByIdStub.resolves(undefined);

      const res = await request(app).post("/orders/1/checkout");

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({ error: "Order not found for id '1'" });
    });

    it("should throw internal server error if payment system is unavailable", async () => {
      resolvesFindOrder({ customOrder: { status: "CREATED" } });
      sendPaymentRequest.rejects();

      const res = await request(app).post("/orders/1/checkout");

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
