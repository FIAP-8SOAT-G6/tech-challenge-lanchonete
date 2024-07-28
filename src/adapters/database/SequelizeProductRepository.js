const Product = require("../../core/entities/Product");
const { sequelize } = require("../../infrastructure/database/models");

const { Product: SequelizeProduct } = sequelize.models;

class SequelizeProductRepository {
  async create(product) {
    const { name, category, description } = product;
    const createdProduct = await SequelizeProduct.create({
      name,
      category,
      description,
    });
    return this.#instantiateProduct(createdProduct);
  }

  async findAll() {
    const products = await SequelizeProduct.findAll();
    return products.map(this.#instantiateProduct);
  }

  async findById(id) {
    const product = await SequelizeProduct.findByPk(id);
    return product ? this.#instantiateProduct(product) : undefined;
  }

  async findByCategory(category) {
    const products = await SequelizeProduct.findAll({
      where: { category: category }
    })
    return products.map(this.#instantiateProduct);
  }

  async update(product) {
    const dbProduct = await SequelizeProduct.findByPk(product.id);
    const updatedProduct = await dbProduct.update({
      name: product.name,
      category: product.category,
      description: product.description,
    });
    return this.#instantiateProduct(updatedProduct);
  }

  async delete(id) {
    const product = await SequelizeProduct.findByPk(id);
    await product.destroy();
  }

  #instantiateProduct(databaseProduct) {
    return new Product(
      databaseProduct.id,
      databaseProduct.name,
      databaseProduct.category,
      databaseProduct.description
    );
  }
}

module.exports = SequelizeProductRepository;
