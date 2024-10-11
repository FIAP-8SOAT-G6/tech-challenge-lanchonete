import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import request from "supertest";
import app from "../../../../src/server";
// import FakeProductRepository from '../../../adapters/database/FakeProductRepository';
//import SequelizeProductRepository from "../../../adapters/database/SequelizeProductRepository";

chai.use(chaiAsPromised);

describe.skip("OrdersController", () => {
  describe("create", () => {
    it("should create a new order", async () => {
      // const repository = new SequelizeProductRepository();
      // const product = await repository.create({
      //   name: "Product1",
      //   category: "Lanche",
      //   description: "HotDog",
      //   price: 200
      // });
      // console.log(product);
      // const orderAttributes = {
      //   code: "0001",
      //   status: "pending"
      // };
      // const res = await request(app).post("/orders").send(orderAttributes);
      // expect(res.status).to.equal(201);
      // expect(res.body.status).to.equal("CREATED");
      // expect(res.body.total_price).to.equal(0);
    });
  });
});
