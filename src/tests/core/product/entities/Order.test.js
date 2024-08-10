const chai = require('chai');
const expect = chai.expect;
const Order = require("../../../../core/orders/entities/Order");

describe('Order', function() {
  let order;

  beforeEach(function() {
    order = new Order('1', 'CODE123', 'pending', 100.0, 'Customer1');
  });

  it('should create an order with the correct properties', function() {
    expect(order).to.have.property('id').that.equals('1');
    expect(order).to.have.property('code').that.equals('CODE123');
    expect(order).to.have.property('status').that.equals('pending');
    expect(order).to.have.property('total_price').that.equals(100.0);
    expect(order).to.have.property('customer').that.equals('Customer1');
    expect(order).to.have.property('items').that.is.an('array').that.is.empty;
  });

  it('should add an item to the order', function() {
    const item = { id: 'item1', name: 'Item 1' };
    order.addItem(item);
    expect(order.items).to.include(item);
  });

  it('should remove an item from the order', function() {
    const item1 = { id: 'item1', name: 'Item 1' };
    const item2 = { id: 'item2', name: 'Item 2' };
    order.addItem(item1);
    order.addItem(item2);
    order.removeItem('item1');
    expect(order.items).to.not.include(item1);
    expect(order.items).to.include(item2);
  });

  it('should initialize with an empty items array if no items are provided', function() {
    const newOrder = new Order('2', 'CODE456', 'completed', 200.0, 'Customer2');
    expect(newOrder.items).to.be.an('array').that.is.empty;
  });
});
