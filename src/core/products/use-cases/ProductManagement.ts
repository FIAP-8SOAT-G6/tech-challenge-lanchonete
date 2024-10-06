import Product from "../entities/Product";
import ProductDTO from "../dto/ProductDTO";
import ProductCategory from "../entities/ProductCategory";
import InvalidCategoryError from "../exceptions/InvalidCategoryError";
import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import ProductRepository from "../../ports/ProductRepository";
import ProductManagementPort from "../../ports/ProductManagement";

export default class ProductManagement implements ProductManagementPort {
  constructor(private productRepository: ProductRepository) {}

  async create(productDTO: ProductDTO): Promise<ProductDTO> {
    const product = this.#toProductEntity(productDTO);
    return await this.productRepository.create(this.#toProductDTO(product));
  }

  async findAll(): Promise<ProductDTO[]> {
    const products = await this.productRepository.findAll();
    return products;
  }

  async findById(id: number): Promise<ProductDTO> {
    const product = await this.productRepository.findById(id);
    if (!product)
      throw new ResourceNotFoundError(
        ResourceNotFoundError.Resources.Product,
        "id",
        id
      );
    return product;
  }

  async findByCategory(category: string): Promise<ProductDTO[]> {
    if (!(category in Object.keys(ProductCategory)))
      throw new InvalidCategoryError(category);
    const productDTOs = await this.productRepository.findByCategory(category);
    return productDTOs;
  }

  async update(productDTO: ProductDTO): Promise<ProductDTO> {
    const { id } = productDTO;
    const currentProductDTO = await this.productRepository.findById(id!);
    if (!currentProductDTO)
      throw new ResourceNotFoundError(
        ResourceNotFoundError.Resources.Product,
        "id",
        id
      );

    const product = this.#toProductEntity(currentProductDTO);
    product.setName(productDTO.name!);
    product.setCategory(productDTO.category!);
    product.setDescription(productDTO.description!);
    product.setPrice(productDTO.price!);
    product.setImages(productDTO.images!);

    const updatedProductDTO = this.#toProductDTO(product);
    return (await this.productRepository.update(updatedProductDTO))!;
  }

  async delete(id: number): Promise<undefined> {
    await this.productRepository.delete(id);
  }

  #toProductDTO(productEntity: Product) {
    return new ProductDTO({
      id: productEntity.getId(),
      name: productEntity.getName(),
      category: productEntity.getCategory(),
      description: productEntity.getDescription(),
      price: productEntity.getPrice(),
      images: productEntity.getImages()
    });
  }

  #toProductEntity(productDTO: ProductDTO) {
    return new Product({
      id: productDTO.id!,
      name: productDTO.name!,
      category: productDTO.category!,
      description: productDTO.description!,
      price: productDTO.price!,
      images: productDTO.images!
    });
  }
}
