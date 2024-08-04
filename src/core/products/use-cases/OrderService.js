const Product = require("../entities/Product");


class OrderService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async create(productValues) {
    const { name, category, description, price } = productValues;
    const product = new Product(null, name, category, description, price);
    return await this.productRepository.create(product);
  }


}

module.exports = ProductManagement;
