const InvalidCategoryError = require("../exceptions/InvalidCategoryError");
const InvalidPropertyError = require("../exceptions/MissingPropertyError");
const ProductCategory = require("./ProductCategory");

class Product {
  constructor(id, name, category, description, price) {
    this.id = id;

    this.setName(name);
    this.setCategory(category);
    this.setDescription(description);
    this.setPrice(price);
  }

  setName(name) {
    this.#validateName(name);
    this.name = name;
  }

  setCategory(category) {
    this.#validateCategory(category);
    this.category = category;
  }

  setPrice(price) {
    this.#validatePrice(price);
    this.price = price;
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

  #validatePrice(price) {
    if (!price || price < 0) {
      throw new InvalidPropertyError("price");
    }
  }
}

module.exports = Product;
