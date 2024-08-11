// TODO: extrair os erros de forma que possam ser reutilizados.
// const InvalidPropertyError = require("../exceptions/MissingPropertyError");

const Item = require("./Item");
const UnexistingItemError = require("../exceptions/UnexistingItemError");
const OrderStatus = require("./OrderStatus");
const InvalidStatusTransitionError = require("../exceptions/InvalidStatusTransitionError");

const ALLOWED_TARGET_STATUS_TRANSITIONS = {
  [OrderStatus.CREATED]: [],
  [OrderStatus.PENDING_PAYMENT]: [OrderStatus.CREATED]
};

class Order {
  #id;
  #code;
  #status;
  #totalPrice;
  #items;

  constructor({ id, code, status, customer, items = [] }) {
    this.#id = id;
    this.#code = code;
    this.#totalPrice = 0;
    this.#items = [];

    this.setStatus(status);
    this.#setItems(items);
  }

  getId() {
    return this.#id;
  }

  getCode() {
    return this.#code;
  }

  getStatus() {
    return this.#status;
  }

  getTotalPrice() {
    return this.#totalPrice;
  }

  getItems() {
    return this.#items;
  }

  getId() {
    return this.#id;
  }

  getCode() {
    return this.#code;
  }

  getStatus() {
    return this.#status;
  }

  getTotalPrice() {
    return this.#totalPrice;
  }

  getItems() {
    return this.#items;
  }

  setStatus(status) {
    const requiredStatusForTarget = ALLOWED_TARGET_STATUS_TRANSITIONS[status];
    if (!this.#status || requiredStatusForTarget.includes(this.#status)) {
      this.#status = status;
    } else {
      throw new InvalidStatusTransitionError(
        this.#status,
        status,
        ALLOWED_TARGET_STATUS_TRANSITIONS[status]
      );
    }
  }

  addItem({
    id,
    productId,
    quantity,
    unitPrice,
    totalPrice,
    productName,
    productDescription
  }) {
    const item = new Item({
      id,
      productId,
      orderId: this.id,
      quantity,
      unitPrice,
      totalPrice,
      productName,
      productDescription
    });
    this.#items.push(item);
<<<<<<< HEAD
    this.#calculateTotalPrice();

=======
>>>>>>> 0f1fbaa0574cbddbf60f0469fd3acb94662d633b
    return item;
  }

  updateItem(itemId, updatedValues) {
    const item = this.#items.find((item) => item.getId() === itemId);

    if (!item) throw new UnexistingItemError(itemId);

    const { quantity } = updatedValues;
    item.setQuantity(quantity);

    this.#calculateTotalPrice();
    return item;
  }

  #setItems(items) {
    items.forEach(this.addItem.bind(this));
  }

  #calculateTotalPrice() {
    this.#totalPrice = this.#items.reduce(
      (currentSum, item) => currentSum + item.getTotalPrice(),
      0
    );
  }
}

module.exports = Order;
