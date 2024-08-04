const Product = require("../entities/Product");
const ProductCategory = require("../entities/ProductCategory");
const InvalidCategoryError = require("../exceptions/InvalidCategoryError");
const UnexistingProductError = require("../exceptions/UnexistingProductError");

class ProductManagement {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async create(productValues) {
    const { name, category, description, price } = productValues;
    const product = new Product(null, name, category, description, price);
    return await this.productRepository.create(product);
  }

  async findAll() {
    const products = await this.productRepository.findAll();
    return products;
  }

  async findById(productId) {
    const product = await this.productRepository.findById(productId);
    return product;
  }

  async findByCategory(category) {
    if (!ProductCategory[category]) throw new InvalidCategoryError(category);
    const products = await this.productRepository.findByCategory(category);
    return products;
  }

  async update(productId, updatedValues) {
    const product = await this.productRepository.findById(productId);

    if (!product) throw new UnexistingProductError(productId);
    product.setName(updatedValues.name);
    product.setCategory(updatedValues.category);
    product.setDescription(updatedValues.description);
    product.setPrice(updatedValues.price);

    return await this.productRepository.update(product);
  }

  async delete(id) {
    await this.productRepository.delete(id);
  }
}

module.exports = ProductManagement;
