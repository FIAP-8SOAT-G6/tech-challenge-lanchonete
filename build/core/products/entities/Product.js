"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidCategoryError_1 = __importDefault(require("../exceptions/InvalidCategoryError"));
const MissingPropertyError_1 = __importDefault(require("../../common/exceptions/MissingPropertyError"));
const ProductCategory_1 = __importDefault(require("./ProductCategory"));
class Product {
    constructor({ id, name, category, description, price, images }) {
        this.id = id;
        this.setName(name);
        this.setCategory(category);
        this.setDescription(description);
        this.setPrice(price);
        this.setImages(images);
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getCategory() {
        return this.category;
    }
    getDescription() {
        return this.description;
    }
    getPrice() {
        return this.price;
    }
    getImages() {
        return this.images;
    }
    setName(name) {
        this.validateName(name);
        this.name = name;
    }
    setCategory(category) {
        this.validateCategory(category);
        this.category = category;
    }
    setPrice(price) {
        this.validatePrice(price);
        this.price = price;
    }
    setDescription(description) {
        this.description = description;
    }
    setImages(images) {
        this.images =
            (images === null || images === void 0 ? void 0 : images.map((url) => ({ productId: this.id, url }))) || [];
    }
    validateName(name) {
        if (!name) {
            throw new MissingPropertyError_1.default("name");
        }
    }
    validateCategory(category) {
        if (!category) {
            throw new MissingPropertyError_1.default("category");
        }
        if (!Object.keys(ProductCategory_1.default).includes(category)) {
            throw new InvalidCategoryError_1.default(category);
        }
    }
    validatePrice(price) {
        if (!price || price < 0) {
            throw new MissingPropertyError_1.default("price");
        }
    }
}
exports.default = Product;
