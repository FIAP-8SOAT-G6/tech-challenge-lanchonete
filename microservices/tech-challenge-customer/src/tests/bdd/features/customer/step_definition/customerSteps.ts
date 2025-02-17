import * as assert from "assert";
import { Given, When, Then } from "@cucumber/cucumber";
import request from "supertest";
import sinon from "sinon";
import app from "../../../../../server";
import SequelizeCustomerDataSource from "../../../../../external/SequelizeCustomerDataSource";

let findByPropertiesStub: sinon.SinonStub;
let createStub: sinon.SinonStub;

let customer: { name: string; cpf: string; email: string };
let newCustomer: { name: string; cpf: string; email: string };
let customerCreated: { id: number; name: string; cpf: string; email: string };
let response: request.Response;

findByPropertiesStub = sinon.stub(SequelizeCustomerDataSource.prototype, "findByProperties");
createStub = sinon.stub(SequelizeCustomerDataSource.prototype, "create");

function buildCustomer() {
  return { name: "", cpf: "", email: "" };
}

function formatCPF(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

Given("that the database is clean", () => {
  newCustomer = buildCustomer();
  response = {} as request.Response;
});

Given("that the system is initialized", () => {
  findByPropertiesStub.resolves(undefined);
  createStub.resolves(undefined);
});

Given("the values provided", function (values: { rawTable: string[][] }) {
  values.rawTable.forEach(([field, value]) => {
    newCustomer = { ...newCustomer, [field]: value };
  });

  customer = newCustomer;
});

Given("cpf {string} is invalid", function (cpf: string) {
  customer = { ...customer, cpf };
});

Given("{string} was not provided", (field: string) => {});

When("registering the customer", async function () {
  customerCreated = { ...customer, cpf: formatCPF(customer.cpf), id: 1 };
  findByPropertiesStub.resolves(undefined);
  createStub.resolves(customerCreated);

  response = await request(app).post("/customers").send(customer);
});

Then("return the registered customer", function () {
  assert.deepEqual(response.body, customerCreated);
});

Then("return message error equal {string}", function (messageExpected: string) {
  assert.deepEqual(response.body.error, messageExpected);
});

When("search the customer by CPF {string}", async (cpf: string) => {
  findByPropertiesStub.resolves([customerCreated]);
  response = await request(app).get("/customers").query({ cpf });
});

When("search the customer by CPF {string} invalid", async (cpf: string) => {
  findByPropertiesStub.resolves();
  response = await request(app).get("/customers").query({ cpf });
});

Then("return customer registered", () => {
  assert.deepEqual(response.body, customerCreated);
});
