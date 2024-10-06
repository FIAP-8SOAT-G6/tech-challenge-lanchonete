"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ItemDTO {
    constructor({ id, orderId, productId, productName, productDescription, quantity, unitPrice, totalPrice }) {
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
exports.default = ItemDTO;
module.exports = ItemDTO;
