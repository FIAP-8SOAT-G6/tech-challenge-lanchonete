// TODO: remover esse arquivo. Não tem necessidade de testar os modelos do sequelize.
// Só adicionei pra debugar um erro.

const chai = require('chai');
const expect = chai.expect;
const { sequelize } = require("../../../../infrastructure/database/models");

const { Order: SequelizeOrder } = sequelize.models;

context('Order', function() {
  describe('#create', function() {
    it('should create an order with the correct properties', async () => {
      let order = await SequelizeOrder.create({
        code: 'CODE123',
        status: 'pending',
        totalPrice: 200
      })

      expect(order).to.have.property('code').that.equals('CODE123');
      expect(order).to.have.property('status').that.equals('pending');
      expect(order).to.have.property('totalPrice').that.equals(200);
    });
  });
});
