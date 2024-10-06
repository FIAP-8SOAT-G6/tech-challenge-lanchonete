"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message = "CPF '&1' provided is invalid";
class InvalidCPFError extends Error {
    constructor(cpf) {
        super(message.replace("&1", cpf));
    }
}
exports.default = InvalidCPFError;
module.exports = InvalidCPFError;
