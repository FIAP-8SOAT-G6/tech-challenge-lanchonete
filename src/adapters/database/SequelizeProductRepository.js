const ProductDTO = require("../../core/products/dto/ProductDTO");
const { sequelize } = require("../../infrastructure/database/models");

const { Product: SequelizeProduct, Image: SequelizeImage } = sequelize.models;

class SequelizeProductRepository {
  async create(productDTO) {
    const { name, category, description, price, images } = productDTO;
    const createdProduct = await SequelizeProduct.create({
      name,
      category,
      description,
      price
    });

    createdProduct.images = await this.#addImages({
      productId: createdProduct.id,
      images
    });

    return this.#createProductDTO(createdProduct);
  }

  async findAll() {
    return await this.#findAllProducts();
  }

  async findById(id) {
    const product = await SequelizeProduct.findByPk(id);
    const images = await this.#findImagesByProductId(id);
    if (images?.length > 0) product.images = images;
    return product ? this.#createProductDTO(product) : undefined;
  }

  async findByCategory(category) {
    return await this.#findAllProducts({ where: { category } });
  }

  async #findImagesByProductId(productId) {
    const images = await SequelizeImage.findAll({
      where: { ProductId: productId }
    });
    return images;
  }

  async update(productDTO) {
    const dbProduct = await SequelizeProduct.findByPk(productDTO.id);
    const updatedProduct = await dbProduct.update({
      name: productDTO.name,
      category: productDTO.category,
      description: productDTO.description,
      price: productDTO.price
    });

    await this.#deleteImages(productDTO.id);

    updatedProduct.images = await this.#addImages({
      productId: productDTO.id,
      images: productDTO?.images
    });

    return this.#createProductDTO(updatedProduct);
  }

  async delete(id) {
    const product = await SequelizeProduct.findByPk(id);
    if (!product) return;
    await product.destroy();
    await this.#deleteImages(id);
  }

  async #findAllProducts(conditions) {
    const products = await SequelizeProduct.findAll(conditions);

    return await Promise.all(
      products.map(async (product) => {
        const images = await this.#findImagesByProductId(product.id);
        if (images?.length > 0) product.images = images;

        return this.#createProductDTO(product);
      })
    );
  }

  async #addImages({ productId, images }) {
    if (!images) return;

    const newImages = await Promise.all(
      images.map((image) =>
        SequelizeImage.create({
          ProductId: productId,
          url: image.url
        })
      )
    );

    return newImages;
  }

  async #deleteImages(productId) {
    const dbImages = await SequelizeImage.findAll({
      where: { ProductId: productId }
    });

    if (dbImages.length > 0) {
      for (const image of dbImages) {
        await image.destroy();
      }
    }
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
