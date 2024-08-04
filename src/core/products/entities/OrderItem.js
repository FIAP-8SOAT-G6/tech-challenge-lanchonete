const InvalidPropertyError = require("../exceptions/MissingPropertyError");

class OrderItem {
  constructor(id, product, quantity) {
    this.id = id;
    this.product = product; // Instância de Product
    this.quantity = quantity;

    this.#validateQuantity(quantity);
  }

  #validateQuantity(quantity) {
    if (!quantity || quantity <= 0) {
      throw new InvalidPropertyError("quantity");
    }
  }
}

module.exports = Item;