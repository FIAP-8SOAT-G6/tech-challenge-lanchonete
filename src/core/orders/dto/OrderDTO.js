class OrderDTO {
  constructor({ id, code, status, totalPrice, items, customerId, customerName }) {
    this.id = id;
    this.code = code;
    this.status = status;
    this.totalPrice = totalPrice;
    this.items = items;
    this.customerId = customerId;
    this.customerName = customerName
  }
}

module.exports = OrderDTO;
