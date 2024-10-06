"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message = "Cannot modify order '&1' with status '&2'.";
class ClosedOrderError extends Error {
    constructor(orderId, status) {
        super(message.replace("&1", orderId).replace("&2", status));
    }
}
exports.default = ClosedOrderError;
module.exports = ClosedOrderError;
