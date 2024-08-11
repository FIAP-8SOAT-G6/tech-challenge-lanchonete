const ProductDTO = require("../../core/products/dto/ProductDTO");
const { sequelize } = require("../../infrastructure/database/models");

const { Product: SequelizeProduct } = sequelize.models;
const { Image: SequelizeImage } = sequelize.models;

class SequelizeProductRepository {
  async create(productDTO) {
    const { name, category, description, price, images } = productDTO;
    const createdProduct = await SequelizeProduct.create({
      name,
      category,
      description,
      price
    });

    await images?.forEach(async (image) => {
      const createdImage = await SequelizeImage.create({
        productId: createdProduct.id,
        url: image.url
      });

      await createdProduct.images.push(createdImage);
    });

    return this.#createProductDTO(createdProduct);
  }

  async findAll() {
    const products = await SequelizeProduct.findAll();
    return products.map(this.#createProductDTO);
  }

  async findById(id) {
    const product = await SequelizeProduct.findByPk(id);
    return product ? this.#createProductDTO(product) : undefined;
  }

  async findByCategory(category) {
    const products = await SequelizeProduct.findAll({
      where: { category: category }
    });
    return products.map(this.#createProductDTO);
  }

  async update(productDTO) {
    const dbProduct = await SequelizeProduct.findByPk(productDTO.id);
    const updatedProduct = await dbProduct.update({
      name: productDTO.name,
      category: productDTO.category,
      description: productDTO.description,
      price: productDTO.price,
      images: productDTO.images
    });
    return this.#createProductDTO(updatedProduct);
  }

  async delete(id) {
    const product = await SequelizeProduct.findByPk(id);
    if (!product) return;
    await product.destroy();
  }

  #createProductDTO(values) {
    return new ProductDTO({
      id: values.id,
      name: values.name,
      category: values.category,
      description: values.description,
      price: values.price,
      images: values.images
    });
  }
}

module.exports = SequelizeProductRepository;
