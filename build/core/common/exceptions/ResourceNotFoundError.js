"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message = "&1 not found for &2 '&3'";
class ResourceNotFoundError extends Error {
    constructor(resourceName, attributeName, attributeValue) {
        super(message
            .replace("&1", resourceName)
            .replace("&2", attributeName)
            .replace("&3", attributeValue));
    }
}
ResourceNotFoundError.Resources = {
    Product: "Product",
    Item: "Item",
    Customer: "Customer",
    Order: "Order"
};
exports.default = ResourceNotFoundError;
module.exports = ResourceNotFoundError;
