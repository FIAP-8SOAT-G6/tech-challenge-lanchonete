const InvalidCategoryError = require("../exceptions/InvalidCategoryError");
const InvalidPropertyError = require("../exceptions/MissingPropertyError");
const ProductCategory = require("./ProductCategory");

class Product {
  constructor(id, name, category, description) {
    this.id = id;
    this.description = description;

    this.setName(name);
    this.setCategory(category);
  }

  setName(name) {
    this.#validateName(name);
    this.name = name;
  }

  setCategory(category) {
    this.#validateCategory(category);
    this.category = category;
  }

  setDescription(description) {
    this.description = description;
  }

  #validateName(name) {
    if (!name) {
      throw new InvalidPropertyError("name");
    }
  }

  #validateCategory(category) {
    if (!category) {
      throw new InvalidPropertyError("category");
    }

    if (!ProductCategory[category]) {
      throw new InvalidCategoryError(category);
    }
  }
}

module.exports = Product;
