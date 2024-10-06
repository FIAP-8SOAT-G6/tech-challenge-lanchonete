"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProductDTO {
    constructor({ id, name, category, description, price, images }) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.price = Number(price);
        this.images = images;
    }
}
exports.default = ProductDTO;
module.exports = ProductDTO;
