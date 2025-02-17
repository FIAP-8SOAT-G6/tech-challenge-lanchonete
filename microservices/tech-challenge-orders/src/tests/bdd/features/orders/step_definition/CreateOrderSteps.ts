import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import request from "supertest";
import app from "../../../../../server";
import CustomersService from "../../../../../external/CustomersService";
import Sinon from "sinon";
import OrderModelDataSource from "../../../../../external/SequelizeOrderDataSource";
import OrderDTO from "../../../../../core/orders/dto/OrderDTO";

const customers = [{ id: 1, name: "Alice" }];
Sinon.replace(
  CustomersService.prototype,
  "findByID",
  Sinon.fake((id: number) => {
    return Promise.resolve(customers.find((customer) => customer.id === id));
  })
);

Sinon.stub(OrderModelDataSource.prototype, "create").callsFake(
  (orderDTO: OrderDTO) =>
    Promise.resolve({ id: Math.trunc(Math.random() * 100), ...orderDTO }) as any
);

Given("I am an anonymous user", function () {
  this.customerId = null;
});

Given("I am customer {string}", async function (customerName) {
  this.customerId =
    customers.find((customer) => customer.name === customerName)?.id;
});

When("I create an order", async function () {
  this.response = await request(app)
    .post("/orders")
    .send({ customerId: this.customerId });
});

Then("should create order with status {string}", function (status: string) {
  expect(this.response.body.status).to.be.equals(status);
});

Then("should create order associated with me", function () {
  expect(this.response.body.customerId).to.be.equal(this.customerId);
});

Then("should not create an order", function () {
  expect(this.response.status).to.not.be.equal(201);
});

Then("should return missing customer error", function () {
  expect(this.response.body.error).to.be.equal(
    `Customer not found for id '${this.customerId}'`
  );
});
