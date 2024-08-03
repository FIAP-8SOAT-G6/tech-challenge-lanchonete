const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const app = require('../app');

chai.use(chaiAsPromised);
const { expect } = chai;

describe('OrdersController', () => {
  describe('create', () => {
    it('should create a new order', async () => {
      const orderAttributes = {
        name: 'Test Product',
        price: 9.99
      };

      const res = await request(app).post('/orders').send(orderAttributes);

      expect(res.status).to.equal(201);
      // expect(res.body).to.have.property('id');
      // expect(res.body.name).to.equal(productData.name);
      expect(res.body).to.equal({ 'xunda': 'loxa' });
    });

    //it('should return an error if name is missing', async () => {
    //  const productData = {
    //    price: 9.99
    //  };
//
    //  const res = await request(app)
    //    .post('/api/products')
    //    .send(productData);
//
    //  expect(res.status).to.equal(400);
    //  expect(res.body).to.have.property('message');
    //});
  });
});