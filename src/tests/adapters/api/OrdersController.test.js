const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const request = require('supertest');
const app = require("../../../../src/server");
const Product = require('../../../core/products/entities/Product');

chai.use(chaiAsPromised);
const { expect } = chai;

describe('OrdersController', () => {
  describe('create', () => {
    it('should create a new order', async () => {
      const product = await productManagementUseCase.create(productValues);

      const orderAttributes = {
        items: [
          {
            product_id: 123, 
            quantity: 10
          }
        ]
      };

      const res = await request(app).post('/orders').send(orderAttributes);

      expect(res.status).to.equal(201);
      expect(res.body.status).to.equal('waiting_approval');
      expect(res.body.total_price).to.equal(1000);
      expect(res.body.items.product_id).to.equal(123);
      expect(res.body.items.quantity).to.equal(10);
      expect(res.body.customer.name).to.equal('Gabriel');
    });
  });
});