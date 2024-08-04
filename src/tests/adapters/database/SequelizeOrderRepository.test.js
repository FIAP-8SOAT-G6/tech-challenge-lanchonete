
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
// TODO Testar fazer sem esse sinon
const sinon = require('sinon');
const { sequelize } = require('../../infrastructure/database/models');
const SequelizeOrderRepository = require('../../repositories/SequelizeOrderRepository');
const Order = require('../../core/products/entities/Product');

chai.use(chaiAsPromised);
const { expect } = chai;

describe('SequelizeOrderRepository', () => {
    let orderRepository;
    let createStub;

    before(async () => {
        orderRepository = new SequelizeOrderRepository();
        await sequelize.sync({ force: true }); 
    });

    afterEach(() => {
        sinon.restore(); 
    });

    it('should create a new order', async () => {
        const orderData = {
            code: 'ORD123',
            status: 'Initial',
        };

        createStub = sinon.stub(sequelize.models.Order, 'create').resolves({
            id: 1,
            code: orderData.code,
            status: orderData.status
        });

        const order = await orderRepository.create(orderData);

        expect(createStub.calledOnce).to.be.true;
        expect(order).to.be.instanceOf(Order);
        expect(order.id).to.equal(1);
        expect(order.code).to.equal(orderData.code);
        expect(order.status).to.equal(orderData.status);
    });
});