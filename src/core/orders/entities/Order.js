const InvalidPropertyError = require("../exceptions/MissingPropertyError");

class Order {
  constructor(id, code, status, total_price, customer, items = []) {
    this.id = id;
    this.code = code; 
    this.status = status;
    this.total_price = total_price;
    this.customer = customer; 
    this.items = items; 
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
  }
}

module.exports = Order;