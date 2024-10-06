"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Item_instances, _Item_updateTotalPrice, _Item_validateQuantity;
Object.defineProperty(exports, "__esModule", { value: true });
const MissingPropertyError_1 = __importDefault(require("../../common/exceptions/MissingPropertyError"));
class Item {
    constructor({ id, orderId, productId, productName, productDescription, quantity, unitPrice }) {
        _Item_instances.add(this);
        this.id = id;
        this.orderId = orderId;
        this.productId = productId;
        this.productName = productName;
        this.productDescription = productDescription;
        this.unitPrice = unitPrice;
        this.setQuantity(quantity);
        __classPrivateFieldGet(this, _Item_instances, "m", _Item_updateTotalPrice).call(this);
    }
    getId() {
        return this.id;
    }
    getOrderId() {
        return this.orderId;
    }
    getProductId() {
        return this.productId;
    }
    getProductName() {
        return this.productName;
    }
    getProductDescription() {
        return this.productDescription;
    }
    getQuantity() {
        return this.quantity;
    }
    getUnitPrice() {
        return this.unitPrice;
    }
    getTotalPrice() {
        return this.totalPrice;
    }
    setQuantity(quantity) {
        __classPrivateFieldGet(this, _Item_instances, "m", _Item_validateQuantity).call(this, quantity);
        this.quantity = quantity;
        __classPrivateFieldGet(this, _Item_instances, "m", _Item_updateTotalPrice).call(this);
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
_Item_instances = new WeakSet(), _Item_updateTotalPrice = function _Item_updateTotalPrice() {
    this.totalPrice = this.unitPrice * this.quantity;
}, _Item_validateQuantity = function _Item_validateQuantity(quantity) {
    if (!quantity || quantity <= 0) {
        throw new MissingPropertyError_1.default("quantity");
    }
};
exports.default = Item;
module.exports = Item;
