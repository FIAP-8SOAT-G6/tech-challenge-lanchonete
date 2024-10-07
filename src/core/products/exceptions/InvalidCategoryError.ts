import ProductCategory from "../entities/ProductCategory";

const ALLOWED_VALUES = Object.keys(ProductCategory);
const message = "Invalid Category '&1'. Allowed values are: '&2'";

export default class InvalidCategoryError extends Error {
  constructor(category: string) {
    const formattedMessage = message
      .replace("&1", category)
      .replace("&2", ALLOWED_VALUES.join(", "));
    super(formattedMessage);
  }
}


