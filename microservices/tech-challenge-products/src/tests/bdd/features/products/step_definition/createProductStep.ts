import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import request from "supertest";
import app from "../../../../../server";
import Sinon from "sinon";
import SequelizeProductDataSource from "../../../../../external/SequelizeProductDataSource";
import ProductDTO from "../../../../../core/products/dto/ProductDTO";

Sinon.stub(SequelizeProductDataSource.prototype, "create").callsFake(
  (ProductDTO: ProductDTO) =>
    Promise.resolve({ id: Math.trunc(Math.random() * 100), ...ProductDTO }) as any
);

let stubbedProducts: ProductDTO[] = [];
Sinon.stub(SequelizeProductDataSource.prototype, "findAll").callsFake(
  () => Promise.resolve(stubbedProducts)
);

Given("I have a product with name {string} and category {string} and price {string}", function (name: string, category: string, price: string) {
  this.name = name;
  this.category = category;
  this.price = price;
});

When('I create the product', async function () {
  this.response = await request(app)
    .post("/products")
    .send({ name: this.name, category: this.category, price: this.price });
});

Then("should create product with name {string}", function (name: string) {
  let expectedResponse = { name: "Hamburguer", category: "Lanche", price: 10 }

  Object.entries(expectedResponse).forEach(([key, value]) => {
    expect(this.response.body[key]).to.be.equal(value);
  });
});

Given("I have these products", function (dataTable) {
  stubbedProducts = dataTable.hashes() as ProductDTO[];
})

When("I list all products", async function () {
  this.response = await request(app).get("/products");
});

Then("should list all products", function () {
  expect(this.response.body).to.have.length(stubbedProducts.length);
});

Then("should list product with name {string}", function (name: string) {
  const product = this.response.body.find((p: ProductDTO) => p.name === name);
  expect(product).to.not.be.undefined;
});
