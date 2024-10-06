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
const ProductDTO_1 = __importDefault(require("../../core/products/dto/ProductDTO"));
const InvalidCategoryError_1 = __importDefault(require("../../core/products/exceptions/InvalidCategoryError"));
const MissingPropertyError_1 = __importDefault(require("../../core/common/exceptions/MissingPropertyError"));
const ResourceNotFoundError_1 = __importDefault(require("../../core/common/exceptions/ResourceNotFoundError"));
class ProductsController {
    constructor(productManagementUseCase) {
        this.router = (0, express_1.Router)();
        this.useCase = productManagementUseCase;
        this.initializeRoutes();
    }
    getRouter() {
        return this.router;
    }
    initializeRoutes() {
        this.router.get("/products", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield this.useCase.findAll();
                return res.status(200).json(products);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        }));
        this.router.get("/products/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const products = yield this.useCase.findById(id);
                return res.status(200).json(products);
            }
            catch (error) {
                if (error instanceof ResourceNotFoundError_1.default) {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: error.message });
            }
        }));
        this.router.post("/products", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description, category, price, images } = req.body;
                const productDTO = new ProductDTO_1.default({
                    name,
                    description,
                    category,
                    price,
                    images
                });
                const product = yield this.useCase.create(productDTO);
                return res.status(201).json(product);
            }
            catch (error) {
                if (error instanceof MissingPropertyError_1.default ||
                    error instanceof InvalidCategoryError_1.default) {
                    return res.status(400).json({ message: error.message });
                }
                return res.status(500).json({ message: error.message });
            }
        }));
        this.router.put("/products/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const { name, description, category, price, images } = req.body;
                const productDTO = new ProductDTO_1.default({
                    id,
                    name,
                    category,
                    description,
                    price,
                    images
                });
                const product = yield this.useCase.update(productDTO);
                return res.status(201).json(product);
            }
            catch (error) {
                if (error instanceof ResourceNotFoundError_1.default) {
                    return res.status(404).json({ message: error.message });
                }
                if (error instanceof MissingPropertyError_1.default ||
                    error instanceof InvalidCategoryError_1.default) {
                    return res.status(400).json({ message: error.message });
                }
                return res.status(500).json({ message: error.message });
            }
        }));
        this.router.delete("/products/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                yield this.useCase.delete(id);
                return res.status(204).json({});
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        }));
        this.router.get("/category/:category/products", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const category = req.params.category;
                const products = yield this.useCase.findByCategory(category);
                return res.status(200).json(products);
            }
            catch (error) {
                if (error instanceof InvalidCategoryError_1.default) {
                    return res.status(400).json({ message: error.message });
                }
                return res.status(500).json({ message: error.message });
            }
        }));
    }
}
exports.default = ProductsController;
module.exports = ProductsController;
