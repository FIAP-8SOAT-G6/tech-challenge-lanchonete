"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomerDTO {
    constructor({ id, name, cpf, email }) {
        this.id = id;
        this.name = name;
        this.cpf = cpf;
        this.email = email;
    }
}
exports.default = CustomerDTO;
module.exports = CustomerDTO;
