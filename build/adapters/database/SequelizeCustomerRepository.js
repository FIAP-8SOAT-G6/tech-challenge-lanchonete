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
var _SequelizeCustomerRepository_instances, _SequelizeCustomerRepository_createCustomerDTO;
Object.defineProperty(exports, "__esModule", { value: true });
const CustomerDTO_1 = __importDefault(require("../../core/customers/dto/CustomerDTO"));
const customer_1 = __importDefault(require("../../infrastructure/database/models/customer"));
class SequelizeCustomerRepository {
    constructor() {
        _SequelizeCustomerRepository_instances.add(this);
    }
    create(customerDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, cpf, email } = customerDTO;
            const newCustomer = yield customer_1.default.create({
                name,
                cpf,
                email
            });
            return __classPrivateFieldGet(this, _SequelizeCustomerRepository_instances, "m", _SequelizeCustomerRepository_createCustomerDTO).call(this, newCustomer);
        });
    }
    findByCPF(cpf) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield customer_1.default.findOne({
                where: { cpf: cpf }
            });
            return __classPrivateFieldGet(this, _SequelizeCustomerRepository_instances, "m", _SequelizeCustomerRepository_createCustomerDTO).call(this, customer);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield customer_1.default.findByPk(id);
            return __classPrivateFieldGet(this, _SequelizeCustomerRepository_instances, "m", _SequelizeCustomerRepository_createCustomerDTO).call(this, customer);
        });
    }
}
_SequelizeCustomerRepository_instances = new WeakSet(), _SequelizeCustomerRepository_createCustomerDTO = function _SequelizeCustomerRepository_createCustomerDTO(dbCustomer) {
    if (!dbCustomer)
        return undefined;
    const { id, name, cpf, email } = dbCustomer;
    return new CustomerDTO_1.default({ id, name, cpf, email });
};
exports.default = SequelizeCustomerRepository;
module.exports = SequelizeCustomerRepository;
