"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message = "&1 already exists for &2 '&3'";
class ResourceAlreadyExistsError extends Error {
    constructor(resourceName, attributeName, attributeValue) {
        super(message
            .replace("&1", resourceName)
            .replace("&2", attributeName)
            .replace("&3", attributeValue));
    }
}
ResourceAlreadyExistsError.Resources = {
    Customer: "Customer"
};
exports.default = ResourceAlreadyExistsError;
module.exports = ResourceAlreadyExistsError;
