const ProductCategory = require("../entities/ProductCategory");

const ALLOWED_VALUES = Object.keys(ProductCategory);
const message = "Invalid Category '&1'. Allowed values are: '&2'";

class InvalidCategoryError extends Error {
  constructor(category) {
    const formattedMessage = message
      .replace("&1", category)
      .replace("&2", ALLOWED_VALUES.join(", "));
    super(formattedMessage);
  }
}

module.exports = InvalidCategoryError;
