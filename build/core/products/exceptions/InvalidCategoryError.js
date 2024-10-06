"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProductCategory_1 = __importDefault(require("../entities/ProductCategory"));
const ALLOWED_VALUES = Object.keys(ProductCategory_1.default);
const message = "Invalid Category '&1'. Allowed values are: '&2'";
class InvalidCategoryError extends Error {
    constructor(category) {
        const formattedMessage = message
            .replace("&1", category)
            .replace("&2", ALLOWED_VALUES.join(", "));
        super(formattedMessage);
    }
}
exports.default = InvalidCategoryError;
module.exports = InvalidCategoryError;
