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
  let createOrderStub: sinon.SinonStub;
  let findByIdOrderStub: sinon.SinonStub;

  beforeEach(() => {
    findByPropertiesCustomerStub = sinon.stub(SequelizeCustomerDataSource.prototype, "findByProperties");
    createOrderStub = sinon.stub(SequelizeOrderDataSource.prototype, "create");
    findByIdOrderStub = sinon.stub(SequelizeOrderDataSource.prototype, "findById");
  });

  it("should create a new order", async () => {
    const customerDTO = new CustomerDTO({ id: 1, name: "Bob", cpf: "12345678909", email: "test@mail.com" });
    findByPropertiesCustomerStub.resolves([customerDTO]);

    const newOrder = { code: "1", customerId: 1, status: "CREATED" };
    const newOrderDTO = new OrderDTO(newOrder);
    const date = new Date();
    const orderCreated = { ...newOrderDTO, id: 1, createdAt: date, totalPrice: 0, paymentStatus: "PENDING", items: [] };
    createOrderStub.resolves(orderCreated);

    const orderAdapter = OrderPresenter.adaptOrderData(orderCreated);
    const res = await request(app).post("/orders").send({ customerId: 1 });

    expect(res.status).to.equal(201);
    expect(res.body).to.deep.equal({ ...orderAdapter, createdAt: date.toISOString() });
    expect(findByPropertiesCustomerStub.calledOnce).to.be.true;
    expect(findByPropertiesCustomerStub.calledOnceWith({ id: 1 })).to.be.true;
    expect(createOrderStub.calledOnce).to.be.true;
    expect(createOrderStub.calledOnceWith(newOrderDTO));
  });
});
