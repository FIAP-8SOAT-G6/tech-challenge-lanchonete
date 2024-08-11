const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const request = require('supertest');
const app = require("../../../../src/server");
// const FakeProductRepository = require('../../../adapters/database/FakeProductRepository');
const SequelizeProductRepository = require('../../../adapters/database/SequelizeProductRepository');

chai.use(chaiAsPromised);
const { expect } = chai;

describe.skip('OrdersController', () => {
  describe('create', () => {
    it('should create a new order', async () => {
      const repository = new SequelizeProductRepository();

      const product = await repository.create({
        name: 'Product1',
        category: 'Lanche',
        description: 'HotDog',
        price: 200
      });

      console.log(product)
      const orderAttributes = {
        code: "0001",
        status: 'pending'
      };

      const res = await request(app).post('/orders').send(orderAttributes);

      expect(res.status).to.equal(201);
      expect(res.body.status).to.equal('waiting_approval');
      expect(res.body.total_price).to.equal(1000);
    });
  });
});
