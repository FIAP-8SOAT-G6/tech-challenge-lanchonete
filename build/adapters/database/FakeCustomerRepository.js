"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _FakeCustomerRepository_instances, _FakeCustomerRepository_createCustomerDTO;
Object.defineProperty(exports, "__esModule", { value: true });
const CustomerDTO_1 = __importDefault(require("../../core/customers/dto/CustomerDTO"));
class FakeCustomerRepository {
    constructor() {
        _FakeCustomerRepository_instances.add(this);
        this.customers = [];
    }
    create(customerDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, cpf, email } = customerDTO;
            const newCustomer = {
                id: this.customers.length + 1,
                name,
                cpf,
                email
            };
            this.customers.push(newCustomer);
            return Promise.resolve(__classPrivateFieldGet(this, _FakeCustomerRepository_instances, "m", _FakeCustomerRepository_createCustomerDTO).call(this, newCustomer));
        });
    }
    findByCPF(cpf) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = this.customers.find((customer) => (customer === null || customer === void 0 ? void 0 : customer.cpf) === cpf);
            return Promise.resolve(__classPrivateFieldGet(this, _FakeCustomerRepository_instances, "m", _FakeCustomerRepository_createCustomerDTO).call(this, customer));
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = this.customers.find((customer) => customer.id === id);
            return Promise.resolve(__classPrivateFieldGet(this, _FakeCustomerRepository_instances, "m", _FakeCustomerRepository_createCustomerDTO).call(this, customer));
        });
    }
}
_FakeCustomerRepository_instances = new WeakSet(), _FakeCustomerRepository_createCustomerDTO = function _FakeCustomerRepository_createCustomerDTO(dbCustomer) {
    if (!dbCustomer)
        return undefined;
    const { id, name, cpf, email } = dbCustomer;
    return new CustomerDTO_1.default({ id, name, cpf, email });
};
exports.default = FakeCustomerRepository;
