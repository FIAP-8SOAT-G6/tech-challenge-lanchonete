const InvalidPropertyError = require("../../products/exceptions/MissingPropertyError");

class Item {
  constructor({
    id,
    orderId,
    productId,
    productName,
    productDescription,
    quantity,
    unitPrice
  }) {
    this.id = id;
    this.orderId = orderId;
    this.productId = productId;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.totalPrice = this.unitPrice * quantity;

    this.productName = productName;
    this.productDescription = productDescription;

    this.#validateQuantity(quantity);
  }

  setQuantity(quantity) {
    this.#validateQuantity(quantity);
    this.quantity = quantity;
    this.updateTotalPrice();
  }

  updateTotalPrice() {
    this.totalPrice = this.unitPrice * this.quantity;
  }

  #validateQuantity(quantity) {
    if (!quantity || quantity <= 0) {
      throw new InvalidPropertyError("quantity");
    }
  }

  getAttributes() {
    return {
      id: this.id,
      orderId: this.orderId,
      productId: this.productId,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      totalPrice: this.totalPrice
    };
  }
}

module.exports = Item;
