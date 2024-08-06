const InvalidPropertyError = require("../../products/exceptions/MissingPropertyError");

class Item {
  constructor(id, product, quantity, unitPrice, totalPrice) {
    this.id = id;
    this.orderId = order;
    this.productId = product; 
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.totalPrice = totalPrice;

    this.#validateQuantity(quantity);
  }

  #validateQuantity(quantity) {
    if (!quantity || quantity <= 0) {
      throw new InvalidPropertyError("quantity");
    }
  }

  toHash() {
    return {
      id: this.id,
      orderId: this.orderId,      
      productId: this.productId,
      quantity: this.quantity,
      unitPrice: this.unitPrice, 
      totalPrice: this.unitPrice
    };
  }
}

module.exports = OrderItem;