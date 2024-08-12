const Item = require("./Item");
const OrderStatus = require("./OrderStatus");

const UnexistingItemError = require("../exceptions/UnexistingItemError");
const EmptyOrderError = require("../exceptions/EmptyOrderError");
const InvalidStatusTransitionError = require("../exceptions/InvalidStatusTransitionError");
const ClosedOrderError = require("../exceptions/ClosedOrderError");

const ALLOWED_TARGET_STATUS_TRANSITIONS = {
  [OrderStatus.CREATED]: [],
  [OrderStatus.PENDING_PAYMENT]: [OrderStatus.CREATED],
  [OrderStatus.PAYED]: [OrderStatus.PENDING_PAYMENT]
};

const statusTransitionValidator = {
  [OrderStatus.CREATED]: function (order) {},
  [OrderStatus.PENDING_PAYMENT]: function (order) {
    if (order.getItems().length === 0) {
      throw new EmptyOrderError();
    }
  },
  [OrderStatus.PAYED]: function (order) {}
};

class Order {
  #id;
  #createdAt;
  #code;
  #status;
  #totalPrice;
  #items;
  #customerId;

  constructor({ id, createdAt, code, status, customerId, items = [] }) {
    this.#id = id;
    this.#createdAt = createdAt;
    this.#code = code;
    this.#totalPrice = 0;
    this.#items = [];
    this.#customerId = customerId;
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

  getCustomerId() {
    return this.#customerId;
  }

  setStatus(status) {
    const requiredStatusForTarget = ALLOWED_TARGET_STATUS_TRANSITIONS[status];
    if (!this.#status || requiredStatusForTarget.includes(this.#status)) {
      const transitionValidator = statusTransitionValidator[status];
      transitionValidator(this);
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
    if (this.getStatus() !== OrderStatus.CREATED)
      throw new ClosedOrderError(this.getId(), this.getStatus());

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
    this.#calculateTotalPrice();

    return item;
  }

  removeItem(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId);
  }

  getElapsedTime() {
    return Date.now() - this.#createdAt.getTime();
  }

  updateItem(itemId, updatedValues) {
    if (this.getStatus() !== OrderStatus.CREATED)
      throw new ClosedOrderError(this.getId(), this.getStatus());

    const item = this.#items.find((item) => item.getId() === itemId);

    if (!item) throw new UnexistingItemError(itemId);

    const { quantity } = updatedValues;
    item.setQuantity(quantity);

    this.#calculateTotalPrice();
    return item;
  }

  removeItem(itemId) {
    if (this.getStatus() !== OrderStatus.CREATED)
      throw new ClosedOrderError(this.getId(), this.getStatus());

    const itemIndex = this.#items.findIndex((item) => item.getId() === itemId);
    if (itemIndex < 0) throw new UnexistingItemError(itemId);

    this.#items.splice(itemIndex, 1);
  }

  #setItems(items) {
    items.forEach(this.#insertIntoItems.bind(this));
    this.#calculateTotalPrice();
  }

  #insertIntoItems(itemDTO) {
    const {
      id,
      productId,
      quantity,
      unitPrice,
      totalPrice,
      productName,
      productDescription
    } = itemDTO;
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
  }

  #calculateTotalPrice() {
    this.#totalPrice = this.#items.reduce(
      (currentSum, item) => currentSum + item.getTotalPrice(),
      0
    );
  }
}

module.exports = Order;
