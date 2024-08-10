const Product = require("../entities/Product");
const ProductDTO = require("../dto/ProductDTO");
const ProductCategory = require("../entities/ProductCategory");
const InvalidCategoryError = require("../exceptions/InvalidCategoryError");
const UnexistingProductError = require("../exceptions/UnexistingProductError");

class ProductManagement {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async create(productDTO) {
    const product = this.#toProductEntity(productDTO);
    return await this.productRepository.create(this.#toProductDTO(product));
  }

  async findAll() {
    const products = await this.productRepository.findAll();
    return products;
  }

  async findById(id) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new UnexistingProductError(id);
    return product;
  }

  async findByCategory(category) {
    if (!ProductCategory[category]) throw new InvalidCategoryError(category);
    const productDTOs = await this.productRepository.findByCategory(category);
    return productDTOs;
  }

  async update(productDTO) {
    const { id } = productDTO;
    const currentProductDTO = await this.productRepository.findById(id);
    if (!currentProductDTO) throw new UnexistingProductError(id);

    const product = this.#toProductEntity(currentProductDTO);
    product.setName(productDTO.name);
    product.setCategory(productDTO.category);
    product.setDescription(productDTO.description);
    product.setPrice(productDTO.price);

    const updatedProductDTO = this.#toProductDTO(product);
    return await this.productRepository.update(updatedProductDTO);
  }

  async delete(id) {
    await this.productRepository.delete(id);
  }

  #toProductDTO(productEntity) {
    return new ProductDTO({
      id: productEntity.getId(),
      name: productEntity.getName(),
      category: productEntity.getCategory(),
      description: productEntity.getDescription(),
      price: productEntity.getPrice()
    });
  }

  #toProductEntity(productDTO) {
    return new Product(
      productDTO.id,
      productDTO.name,
      productDTO.category,
      productDTO.description,
      productDTO.price
    );
  }
}

module.exports = ProductManagement;
