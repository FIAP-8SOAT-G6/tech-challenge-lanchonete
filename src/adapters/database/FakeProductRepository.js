const Product = require("../../core/entities/Product");

class FakeProductRepository {
  #products = [];

  async create(product) {
    const { name, category, description, price } = product;
    const createdProduct = {
      id: this.#products.length + 1,
      name,
      category,
      description,
      price
    };
    this.#products.push(createdProduct);
    return Promise.resolve(this.#instantiateProduct(createdProduct));
  }

  async findAll() {
    return Promise.resolve(this.#products.map(this.#instantiateProduct))
  }

  async findById(id) {
    const product = this.#products.find((product) => product?.id === id);
    return Promise.resolve(
      product ? this.#instantiateProduct(product) : undefined
    );
  }

  async findByCategory(category) {
    const products = this.#products.filter((product) => product?.category === category);
    return Promise.resolve(products.map(this.#instantiateProduct));
  }

  delete(id) {
    const productIndex = this.#products.findIndex(
      (product) => product?.id === id
    );
    delete this.#products[productIndex];
    return Promise.resolve();
  }

  update(product) {
    const productIndex = this.#products.findIndex(
      (persistedProduct) => persistedProduct?.id === product.id
    );

    this.#products[productIndex].name = product.name;
    this.#products[productIndex].category = product.category;
    this.#products[productIndex].description = product.description;
    this.#products[productIndex].price = product.price;

    return this.#instantiateProduct(this.#products[productIndex]);
  }

  #instantiateProduct(databaseProduct) {
    return new Product(
      databaseProduct.id,
      databaseProduct.name,
      databaseProduct.category,
      databaseProduct.description,
      databaseProduct.price
    );
  }
}

module.exports = FakeProductRepository;
