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
var _CustomerManagement_instances, _CustomerManagement_toCustomerDTO, _CustomerManagement_toCustomerEntity;
Object.defineProperty(exports, "__esModule", { value: true });
const Customer_1 = __importDefault(require("../entities/Customer"));
const CustomerDTO_1 = __importDefault(require("../dto/CustomerDTO"));
const ResourceNotFoundError_1 = __importDefault(require("../../common/exceptions/ResourceNotFoundError"));
const ResourceAlreadyExistsError_1 = __importDefault(require("../../common/exceptions/ResourceAlreadyExistsError"));
const MissingPropertyError_1 = __importDefault(require("../../common/exceptions/MissingPropertyError"));
class CustomerManagement {
    constructor(customerRepository) {
        _CustomerManagement_instances.add(this);
        this.customerRepository = customerRepository;
    }
    create(customerDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = __classPrivateFieldGet(this, _CustomerManagement_instances, "m", _CustomerManagement_toCustomerEntity).call(this, customerDTO);
            yield this.validateCustomerExistence(customer.getCpf());
            return yield this.customerRepository.create(__classPrivateFieldGet(this, _CustomerManagement_instances, "m", _CustomerManagement_toCustomerDTO).call(this, customer));
        });
    }
    findByCPF(cpf) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cpf)
                throw new MissingPropertyError_1.default("cpf");
            const customer = yield this.customerRepository.findByCPF(cpf);
            if (!customer)
                throw new ResourceNotFoundError_1.default(ResourceNotFoundError_1.default.Resources.Customer, "cpf", cpf);
            return customer;
        });
    }
    validateCustomerExistence(cpf) {
        return __awaiter(this, void 0, void 0, function* () {
            const validateCustomerExistence = yield this.customerRepository.findByCPF(cpf);
            if (validateCustomerExistence) {
                throw new ResourceAlreadyExistsError_1.default(ResourceAlreadyExistsError_1.default.Resources.Customer, "cpf", cpf);
            }
        });
    }
}
_CustomerManagement_instances = new WeakSet(), _CustomerManagement_toCustomerDTO = function _CustomerManagement_toCustomerDTO(customerEntity) {
    return new CustomerDTO_1.default({
        id: customerEntity.getId(),
        name: customerEntity.getName(),
        cpf: customerEntity.getCpf(),
        email: customerEntity.getEmail()
    });
}, _CustomerManagement_toCustomerEntity = function _CustomerManagement_toCustomerEntity(customerDTO) {
    return new Customer_1.default({
        id: customerDTO.id,
        name: customerDTO.name,
        cpf: customerDTO.cpf,
        email: customerDTO.email
    });
};
exports.default = CustomerManagement;
module.exports = CustomerManagement;
