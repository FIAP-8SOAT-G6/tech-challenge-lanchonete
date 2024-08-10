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
  constructor({ id, code, status, totalPrice, customer, items = [], createdAt }) {
    this.id = id;
    this.code = code;
    this.totalPrice = totalPrice;
    this.items = [];
    this.createdAt = createdAt;

    this.setStatus(status);

    items?.forEach(this.addItem.bind(this));
  }

  setStatus(status) {
    const requiredStatusForTarget = ALLOWED_TARGET_STATUS_TRANSITIONS[status];
    if (!this.status || requiredStatusForTarget.includes(this.status)) {
      this.status = status;
    } else {
      throw new InvalidStatusTransitionError(
        this.status,
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
    this.items.push(item);
    return item;
  }

  removeItem(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId);
  }

  getElapsedTime() {
    return Date.now() - this.createdAt.getTime();
  }

  updateItem(itemId, updatedValues) {
    const item = this.items.find((item) => item.id === itemId);

    if (!item) throw new UnexistingItemError(itemId);

    const { quantity } = updatedValues;
    item.setQuantity(quantity);
    return item;
  }
}

module.exports = Order;
