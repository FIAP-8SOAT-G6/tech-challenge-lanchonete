class OrderDTO {
  constructor({ id, createdAt, code, status, totalPrice, items, customerId, customerName, elapsedTime }) {
    this.id = id;
    this.createdAt = createdAt;
    this.code = code;
    this.status = status;
    this.totalPrice = totalPrice;
    this.items = items;
    this.customerId = customerId;
    this.customerName = customerName;
    this.elapsedTime = elapsedTime;
  }
}

module.exports = OrderDTO;
