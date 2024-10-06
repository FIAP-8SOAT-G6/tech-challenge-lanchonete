"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MissingPropertyError_1 = __importDefault(require("../../common/exceptions/MissingPropertyError"));
class Customer {
    constructor({ id, name, cpf, email }) {
        this.id = id;
        this.setName(name);
        this.setCPF(cpf);
        this.setEmail(email);
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getCpf() {
        return this.cpf;
    }
    getEmail() {
        return this.email;
    }
    setName(name) {
        this.validateName(name);
        this.name = name;
    }
    setCPF(cpf) {
        this.validateCPF(cpf);
        this.cpf = cpf;
    }
    setEmail(email) {
        this.validateEmail(email);
        this.email = email;
    }
    validateName(name) {
        if (!name) {
            throw new MissingPropertyError_1.default("name");
        }
    }
    validateCPF(cpf) {
        if (!cpf) {
            throw new MissingPropertyError_1.default("cpf");
        }
    }
    validateEmail(email) {
        if (!email) {
            throw new MissingPropertyError_1.default("email");
        }
    }
}
exports.default = Customer;
module.exports = Customer;
