import Product from "../entities/Product";
import ProductDTO from "../dto/ProductDTO";
import CreateProduct from "../interfaces/CreateProduct";
import ProductGateway from "../../interfaces/ProductGateway";

export default class CreateProductUseCase implements CreateProduct {
  constructor(private productGateway: ProductGateway) {}

  async createProduct(productDTO: ProductDTO): Promise<ProductDTO> {
    const product = this.#toProductEntity(productDTO);
    return await this.productGateway.createProduct(this.#toProductDTO(product));
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
