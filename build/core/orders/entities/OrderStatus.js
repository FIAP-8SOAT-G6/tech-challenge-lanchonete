"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
exports.isValidOrderStatus = isValidOrderStatus;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["CREATED"] = "CREATED";
    OrderStatus["PENDING_PAYMENT"] = "PENDING_PAYMENT";
    OrderStatus["PAYED"] = "PAYED";
    OrderStatus["RECEIVED"] = "RECEIVED";
    OrderStatus["PREPARING"] = "PREPARING";
    OrderStatus["FINISHED"] = "FINISHED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
function isValidOrderStatus(value) {
    return Object.values(OrderStatus).includes(value);
}
