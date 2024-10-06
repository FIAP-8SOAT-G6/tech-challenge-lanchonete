"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message = "Missing property '&1'";
class MissingPropertyError extends Error {
    constructor(property) {
        super(message.replace("&1", property));
    }
}
exports.default = MissingPropertyError;
module.exports = MissingPropertyError;
