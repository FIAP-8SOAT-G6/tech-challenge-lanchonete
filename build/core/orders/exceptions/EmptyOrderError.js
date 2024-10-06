"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message = "Cannot checkout empty order.";
class EmptyOrderError extends Error {
    constructor() {
        super(message);
    }
}
exports.default = EmptyOrderError;
module.exports = EmptyOrderError;
