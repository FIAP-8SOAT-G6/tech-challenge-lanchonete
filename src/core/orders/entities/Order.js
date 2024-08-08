// TODO: extrair os erros de forma que possam ser reutilizados.
// const InvalidPropertyError = require("../exceptions/MissingPropertyError");

const Item = require("./Item");

class Order {
  constructor({ id, code, status, totalPrice, customer, items = [] }) {
    this.id = id;
    this.code = code;
    this.status = status;
    this.totalPrice = totalPrice;
    this.items = [];

    items?.forEach(this.addItem);
  }

  addItem({
    id,
    productId,
    quantity,
    unitPrice,
    totalPrice,
    productName,
    productDescription,
  }) {
    const item = new Item({
      id,
      productId,
      orderId: this.id,
      quantity,
      unitPrice,
      totalPrice,
      productName,
      productDescription,
    });
    this.items.push(item);
    return item;
  }

  removeItem(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId);
  }
}

module.exports = Order;
