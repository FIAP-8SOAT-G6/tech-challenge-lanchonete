import ProductDTO from "../dto/ProductDTO";
import Product from "../entities/Product";

export default class ProductMapper {
  static toProductDTO(productEntity: Product) {
    return new ProductDTO({
      id: productEntity.getId(),
      name: productEntity.getName(),
      category: productEntity.getCategory(),
      description: productEntity.getDescription(),
      price: productEntity.getPrice(),
      images: productEntity.getImages()
    });
  }

  static toProductEntity(productDTO: ProductDTO) {
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
