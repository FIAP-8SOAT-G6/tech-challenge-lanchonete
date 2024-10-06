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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CustomerDTO_1 = __importDefault(require("../../core/customers/dto/CustomerDTO"));
const MissingPropertyError_1 = __importDefault(require("../../core/common/exceptions/MissingPropertyError"));
const ResourceNotFoundError_1 = __importDefault(require("../../core/common/exceptions/ResourceNotFoundError"));
const ResourceAlreadyExistsError_1 = __importDefault(require("../../core/common/exceptions/ResourceAlreadyExistsError"));
class CustomerController {
    constructor(customerManagementUseCase) {
        this.router = (0, express_1.Router)();
        this.useCase = customerManagementUseCase;
        this.initializeRoutes();
    }
    getRouter() {
        return this.router;
    }
    initializeRoutes() {
        this.router.get("/customers/:cpf", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const cpf = req.params.cpf;
                const customerFound = yield this.useCase.findByCPF(cpf);
                return res.status(200).json(customerFound);
            }
            catch (error) {
                if (error instanceof ResourceNotFoundError_1.default) {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: error.message });
            }
        }));
        this.router.post("/customers", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, cpf, email } = req.body;
                const customerDTO = new CustomerDTO_1.default({
                    name,
                    cpf,
                    email
                });
                const customerCreated = yield this.useCase.create(customerDTO);
                return res.status(201).json(customerCreated);
            }
            catch (error) {
                if (error instanceof MissingPropertyError_1.default ||
                    error instanceof ResourceAlreadyExistsError_1.default) {
                    return res.status(400).json({ message: error.message });
                }
                return res.status(500).json({ message: error.message });
            }
        }));
    }
}
exports.default = CustomerController;
module.exports = CustomerController;
