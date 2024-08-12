const InvalidCategoryError = require("../exceptions/InvalidCategoryError");
const MissingPropertyError = require("../../common/exceptions/MissingPropertyError");
const ProductCategory = require("./ProductCategory");

class Product {
  #id;
  #name;
  #category;
  #description;
  #price;
  #images;

  constructor({ id, name, category, description, price, images }) {
    this.#id = id;

    this.setName(name);
    this.setCategory(category);
    this.setDescription(description);
    this.setPrice(price);
    this.setImages(images);
  }

  getId() {
    return this.#id;
  }

  getName() {
    return this.#name;
  }

  getCategory() {
    return this.#category;
  }

  getDescription() {
    return this.#description;
  }

  getPrice() {
    return this.#price;
  }

  getImages() {
    return this.#images;
  }

  setName(name) {
    this.#validateName(name);
    this.#name = name;
  }

  setCategory(category) {
    this.#validateCategory(category);
    this.#category = category;
  }

  setPrice(price) {
    this.#validatePrice(price);
    this.#price = price;
  }

  setDescription(description) {
    this.#description = description;
  }

  setImages(images) {
    this.#images = images?.map((url) => ({ productId: this.id, url })) || [];
  }

  #validateName(name) {
    if (!name) {
      throw new MissingPropertyError("name");
    }
  }

  #validateCategory(category) {
    if (!category) {
      throw new MissingPropertyError("category");
    }

    if (!ProductCategory[category]) {
      throw new InvalidCategoryError(category);
    }
  }

  #validatePrice(price) {
    if (!price || price < 0) {
      throw new MissingPropertyError("price");
    }
  }
}

module.exports = Product;
