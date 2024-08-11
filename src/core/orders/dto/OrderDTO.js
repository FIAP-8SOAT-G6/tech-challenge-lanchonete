class OrderDTO {
  constructor({ id, code, status, totalPrice, items }) {
    this.id = id;
    this.code = code;
    this.status = status;
    this.totalPrice = totalPrice;
    this.items = items;
  }
}

module.exports = OrderDTO;