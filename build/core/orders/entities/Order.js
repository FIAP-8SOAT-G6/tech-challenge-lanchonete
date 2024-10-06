"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Order_instances, _Order_insertIntoItems, _Order_calculateTotalPrice;
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("./Item"));
const OrderStatus_1 = require("./OrderStatus");
const EmptyOrderError_1 = __importDefault(require("../exceptions/EmptyOrderError"));
const InvalidStatusTransitionError_1 = __importDefault(require("../exceptions/InvalidStatusTransitionError"));
const ClosedOrderError_1 = __importDefault(require("../exceptions/ClosedOrderError"));
const ResourceNotFoundError_1 = __importDefault(require("../../common/exceptions/ResourceNotFoundError"));
const ALLOWED_TARGET_STATUS_TRANSITIONS = {
    [OrderStatus_1.OrderStatus.CREATED]: [],
    [OrderStatus_1.OrderStatus.PENDING_PAYMENT]: [OrderStatus_1.OrderStatus.CREATED],
    [OrderStatus_1.OrderStatus.PAYED]: [OrderStatus_1.OrderStatus.PENDING_PAYMENT],
    [OrderStatus_1.OrderStatus.RECEIVED]: [],
    [OrderStatus_1.OrderStatus.PREPARING]: [],
    [OrderStatus_1.OrderStatus.FINISHED]: []
};
const statusTransitionValidator = {
    [OrderStatus_1.OrderStatus.CREATED]: function (order) { },
    [OrderStatus_1.OrderStatus.PENDING_PAYMENT]: function (order) {
        if (order.getItems().length === 0) {
            throw new EmptyOrderError_1.default();
        }
    },
    [OrderStatus_1.OrderStatus.PAYED]: function (order) { },
    [OrderStatus_1.OrderStatus.RECEIVED]: function (order) { },
    [OrderStatus_1.OrderStatus.PREPARING]: function (order) { },
    [OrderStatus_1.OrderStatus.FINISHED]: function (order) { }
};
class Order {
    constructor({ id, createdAt, code, status, customerId, items = [] }) {
        _Order_instances.add(this);
        this.id = id;
        this.createdAt = createdAt;
        this.code = code;
        this.totalPrice = 0;
        this.items = [];
        this.customerId = customerId;
        this.setStatus(status);
        this.setItems(items);
    }
    getId() {
        return this.id;
    }
    getCode() {
        return this.code;
    }
    getStatus() {
        return this.status;
    }
    getTotalPrice() {
        return this.totalPrice;
    }
    getCustomerId() {
        return this.customerId;
    }
    getItems() {
        return this.items;
    }
    setStatus(status) {
        if ((0, OrderStatus_1.isValidOrderStatus)(status)) {
            const requiredStatusForTarget = ALLOWED_TARGET_STATUS_TRANSITIONS[status];
            if (!this.status || requiredStatusForTarget.includes(this.status)) {
                const transitionValidator = statusTransitionValidator[status];
                transitionValidator(this);
                this.status = status;
            }
            else {
                throw new InvalidStatusTransitionError_1.default(this.status, status, ALLOWED_TARGET_STATUS_TRANSITIONS[status]);
            }
        }
    }
    addItem({ id, productId, quantity, unitPrice, totalPrice, productName, productDescription }) {
        if (this.getStatus() !== OrderStatus_1.OrderStatus.CREATED)
            throw new ClosedOrderError_1.default(this.getId(), this.getStatus());
        const item = new Item_1.default({
            id,
            productId,
            orderId: this.id,
            quantity,
            unitPrice,
            productName,
            productDescription
        });
        this.items.push(item);
        __classPrivateFieldGet(this, _Order_instances, "m", _Order_calculateTotalPrice).call(this);
        return item;
    }
    getElapsedTime() {
        if (!this.createdAt)
            return 0;
        return Date.now() - this.createdAt.getTime();
    }
    updateItem(itemId, updatedValues) {
        if (this.getStatus() !== OrderStatus_1.OrderStatus.CREATED)
            throw new ClosedOrderError_1.default(this.getId(), this.getStatus());
        const item = this.items.find((item) => item.getId() === itemId);
        if (!item)
            throw new ResourceNotFoundError_1.default(ResourceNotFoundError_1.default.Resources.Item, "id", itemId);
        const { quantity } = updatedValues;
        item.setQuantity(quantity);
        __classPrivateFieldGet(this, _Order_instances, "m", _Order_calculateTotalPrice).call(this);
        return item;
    }
    removeItem(itemId) {
        if (this.getStatus() !== OrderStatus_1.OrderStatus.CREATED)
            throw new ClosedOrderError_1.default(this.getId(), this.getStatus());
        const itemIndex = this.items.findIndex((item) => item.getId() === itemId);
        if (itemIndex < 0)
            throw new ResourceNotFoundError_1.default(ResourceNotFoundError_1.default.Resources.Item, "id", itemId);
        this.items.splice(itemIndex, 1);
    }
    setItems(items) {
        items.forEach(__classPrivateFieldGet(this, _Order_instances, "m", _Order_insertIntoItems).bind(this));
        __classPrivateFieldGet(this, _Order_instances, "m", _Order_calculateTotalPrice).call(this);
    }
}
_Order_instances = new WeakSet(), _Order_insertIntoItems = function _Order_insertIntoItems(itemDTO) {
    const { id, productId, quantity, unitPrice, totalPrice, productName, productDescription } = itemDTO;
    const item = new Item_1.default({
        id,
        productId: productId,
        orderId: this.id,
        quantity: quantity,
        unitPrice: unitPrice,
        productName,
        productDescription
    });
    this.items.push(item);
}, _Order_calculateTotalPrice = function _Order_calculateTotalPrice() {
    this.totalPrice = Number(this.items
        .reduce((currentSum, item) => currentSum + item.getTotalPrice(), 0)
        .toFixed(2));
};
exports.default = Order;
