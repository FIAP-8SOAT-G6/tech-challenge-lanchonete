const InvalidPropertyError = require("../../products/exceptions/MissingPropertyError");

class Item {
  #id;
  #orderId;
  #productId;
  #productName;
  #productDescription;
  #quantity;
  #unitPrice;
  #totalPrice;

  constructor({
    id,
    orderId,
    productId,
    productName,
    productDescription,
    quantity,
    unitPrice
  }) {
    this.#id = id;
    this.#orderId = orderId;
    this.#productId = productId;

    this.#productName = productName;
    this.#productDescription = productDescription;
    this.#unitPrice = unitPrice;

    this.setQuantity(quantity);

    this.#updateTotalPrice();
  }

  getId() {
    return this.#id;
  }

  getOrderId() {
    return this.#orderId;
  }

  getProductId() {
    return this.#productId;
  }

  getProductName() {
    return this.#productName;
  }

  getProductDescription() {
    return this.#productDescription;
  }

  getQuantity() {
    return this.#quantity;
  }

  getUnitPrice() {
    return this.#unitPrice;
  }

  getTotalPrice() {
    return this.#totalPrice;
  }

  setQuantity(quantity) {
    this.#validateQuantity(quantity);
    this.#quantity = quantity;
    this.#updateTotalPrice();
  }

  #updateTotalPrice() {
    this.#totalPrice = this.#unitPrice * this.#quantity;
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
