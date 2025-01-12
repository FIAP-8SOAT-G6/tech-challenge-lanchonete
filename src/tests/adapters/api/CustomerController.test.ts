import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import request from "supertest";
import app from "../../../../src/server";
import SequelizeCustomerDataSource from "../../../external/SequelizeCustomerDataSource";
import ResourceNotFoundError from "../../../core/common/exceptions/ResourceNotFoundError";
import sinon from "sinon";
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
    const customerCreated = { ...customer, id: "1", cpf: "123.456.789-09" };

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
    expect(res.body).to.deep.equal({ message: new MissingPropertyError("email").message });
    expect(findByPropertiesStub.called).to.be.false;
    expect(createStub.called).to.be.false;
  });

  it("should return error message when customer information is wrong to register the customer", async () => {
    const customer = buildCustomer({ cpf: "123" });

    const res = await request(app).post("/customers").send(customer);

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ message: new InvalidAttributeError("cpf", customer.cpf).message });
    expect(findByPropertiesStub.called).to.be.false;
    expect(createStub.called).to.be.false;
  });

  it("should return error message when the customer is already registered", async () => {
    const customer = buildCustomer();
    const customerCreated = { ...customer, id: "1", cpf: "123.456.789-09" };

    findByPropertiesStub.resolves(undefined);
    createStub.resolves(customerCreated);
    await request(app).post("/customers").send(customer);

    findByPropertiesStub.resolves([customerCreated]);
    const res = await request(app).post("/customers").send(customer);

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({
      message: new ResourceAlreadyExistsError(ResourceAlreadyExistsError.Resources.Customer, "cpf", customer.cpf).message
    });
    expect(findByPropertiesStub.calledTwice).to.be.true;
  });

  it("should return error message when an error occurs to register the customer", async () => {
    findByPropertiesStub.rejects();

    const customer = buildCustomer();

    const res = await request(app).post("/customers").send(customer);

    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ message: "Error" });
    expect(findByPropertiesStub.calledOnce).to.be.true;
  });

  it("should find customer by cpf", async () => {
    const customer = buildCustomer();
    const customerCreated = { ...customer, id: "1", cpf: "123.456.789-09" };

    findByPropertiesStub.resolves(undefined);
    createStub.resolves(customerCreated);
    await request(app).post("/customers").send(customer);

    findByPropertiesStub.resolves([customerCreated]);
    await request(app).post("/customers").send(customer);
    const res = await request(app).get(`/customers/${customer.cpf}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(customerCreated);
  });

  it("should return error message when client is not found", async () => {
    const cpf = "12345678909";
    const res = await request(app).get(`/customers/${cpf}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.deep.equal({ message: new ResourceNotFoundError(ResourceNotFoundError.Resources.Customer, "cpf", cpf).message });
    expect(findByPropertiesStub.called).to.be.true;
    expect(createStub.called).to.be.false;
  });

  it("should return error message of Route not found when the CPF is not informed for customer search", async () => {
    const res = await request(app).get("/customers/");

    expect(res.status).to.equal(404);
    expect(res.body).to.deep.equal({ message: "Route not found" });
    expect(findByPropertiesStub.called).to.be.false;
    expect(createStub.called).to.be.false;
  });

  it("should return error message when an error occurs to register the customer", async () => {
    findByPropertiesStub.rejects();

    const res = await request(app).get("/customers/1234");

    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ message: "Error" });
    expect(findByPropertiesStub.calledOnce).to.be.true;
  });
});
