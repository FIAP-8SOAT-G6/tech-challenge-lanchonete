class ItemDTO {
  constructor({
    id,
    orderId,
    productId,
    productName,
    productDescription,
    quantity,
    unitPrice,
    totalPrice
  }) {
    this.id = id;
    this.orderId = orderId;
    this.productId = productId;
    this.productName = productName;
    this.productDescription = productDescription;
    this.quantity = Number(quantity);
    this.unitPrice = Number(unitPrice);
    this.totalPrice = Number(totalPrice);
  }
}

module.exports = ItemDTO;
