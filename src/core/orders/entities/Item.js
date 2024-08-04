const InvalidPropertyError = require("../../products/exceptions/MissingPropertyError");

class Item {
  constructor(id, product, quantity) {
    this.id = id;
    this.product_id = product; 
    this.order_id = order;
    this.quantity = quantity;

    this.#validateQuantity(quantity);
  }

  #validateQuantity(quantity) {
    if (!quantity || quantity <= 0) {
      throw new InvalidPropertyError("quantity");
    }
  }
}

module.exports = OrderItem;