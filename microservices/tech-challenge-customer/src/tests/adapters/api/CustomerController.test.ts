import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import request from "supertest";
import app from "../../../server";
import sinon from "sinon";
import SequelizeCustomerDataSource from "../../../external/SequelizeCustomerDataSource";
import ResourceNotFoundError from "../../../core/common/exceptions/ResourceNotFoundError";
import CustomerDTO from "../../../core/customers/dto/CustomerDTO";
import MissingPropertyError from "../../../core/common/exceptions/MissingPropertyError";
import InvalidAttributeError from "../../../core/common/exceptions/InvalidAttributeError";
import ResourceAlreadyExistsError from "../../../core/common/exceptions/ResourceAlreadyExistsError";

chai.use(chaiAsPromised);

describe("Customer Controller", () => {
  let findByPropertiesStub: sinon.SinonStub;
  let createStub: sinon.SinonStub;

  function buildCustomer(customProps = {}) {
    return { name: "Bob", cpf: "12345678909", email: "test@mail.com", ...customProps };
  }

  beforeEach(() => {
    findByPropertiesStub = sinon.stub(SequelizeCustomerDataSource.prototype, "findByProperties");
    createStub = sinon.stub(SequelizeCustomerDataSource.prototype, "create");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return the customer on successful customer registration", async () => {
    const customer = buildCustomer();
    const customerDTO = new CustomerDTO(customer);
    const customerCreated = { ...customer, id: 1, cpf: "123.456.789-09" };

    findByPropertiesStub.resolves(undefined);
    createStub.resolves(customerCreated);

    const res = await request(app).post("/customers").send(customer);
    expect(res.status).to.equal(201);
    expect(res.body).to.deep.equal(customerCreated);
    expect(findByPropertiesStub.calledOnce).to.be.true;
    expect(findByPropertiesStub.calledOnceWith({ cpf: customer.cpf })).to.be.true;
    expect(createStub.calledOnce).to.be.true;
    expect(createStub.calledOnceWith(customerDTO)).to.be.true;
  });

  it("should return error message when there is missing information on the customer to register the customer", async () => {
    const customer = buildCustomer({ email: "" });
    const res = await request(app).post("/customers").send(customer);

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ error: new MissingPropertyError("email").message });
    expect(findByPropertiesStub.called).to.be.false;
    expect(createStub.called).to.be.false;
  });

  it("should return error message when customer information is wrong to register the customer", async () => {
    const customer = buildCustomer({ cpf: "123" });

    const res = await request(app).post("/customers").send(customer);

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ error: new InvalidAttributeError("cpf", customer.cpf).message });
    expect(findByPropertiesStub.called).to.be.false;
    expect(createStub.called).to.be.false;
  });

  it("should return error message when the customer is already registered", async () => {
    const customer = buildCustomer();
    const customerCreated = { ...customer, id: 1, cpf: "123.456.789-09" };

    findByPropertiesStub.resolves([customerCreated]);
    const res = await request(app).post("/customers").send(customer);

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({
      error: new ResourceAlreadyExistsError("cpf", customer.cpf).message
    });
    expect(findByPropertiesStub.calledOnce).to.be.true;
  });

  it("should return error message when an error occurs to register the customer", async () => {
    findByPropertiesStub.rejects();

    const customer = buildCustomer();
    const res = await request(app).post("/customers").send(customer);

    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: "Error" });
    expect(findByPropertiesStub.calledOnce).to.be.true;
  });

  it("should find customer by cpf", async () => {
    const customer = buildCustomer();
    const customerCreated = { ...customer, id: 1, cpf: "123.456.789-09" };
    findByPropertiesStub.resolves([customerCreated]);

    const res = await request(app).get(`/customers`).query({ cpf: customer.cpf });

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(customerCreated);
  });

  it("should return error message when client is not found", async () => {
    const cpf = "12345678909";
    const res = await request(app).get(`/customers`).query({ cpf });

    expect(res.status).to.equal(404);
    expect(res.body).to.deep.equal({ error: new ResourceNotFoundError("cpf", cpf).message });
    expect(findByPropertiesStub.called).to.be.true;
    expect(createStub.called).to.be.false;
  });

  it("should return error message when an error occurs to search the customer", async () => {
    findByPropertiesStub.rejects();

    const res = await request(app).get("/customers").query({ cpf: "1234" });

    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: "Error" });
    expect(findByPropertiesStub.calledOnce).to.be.true;
  });

  it("should find customer by id", async () => {
    const customer = buildCustomer();
    const customerCreated = { ...customer, id: 1, cpf: "123.456.789-09" };
    findByPropertiesStub.resolves([customerCreated]);

    const res = await request(app).get(`/customers/1`);

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(customerCreated);
  });

  it("should return error message when client is not found", async () => {
    const id = "2";
    const res = await request(app).get(`/customers/${id}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.deep.equal({ error: new ResourceNotFoundError("id", id).message });
    expect(findByPropertiesStub.called).to.be.true;
    expect(createStub.called).to.be.false;
  });

  it("should return error message when an error occurs to search the customer", async () => {
    findByPropertiesStub.rejects();

    const res = await request(app).get(`/customers/1234`);

    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: "Error" });
    expect(findByPropertiesStub.calledOnce).to.be.true;
  });

  it("should return error message of Route not found when route is invalid", async () => {
    const res = await request(app).put("/customers/");

    expect(res.status).to.equal(404);
    expect(res.body).to.deep.equal({ error: "Route not found" });
    expect(findByPropertiesStub.called).to.be.false;
    expect(createStub.called).to.be.false;
  });
});
