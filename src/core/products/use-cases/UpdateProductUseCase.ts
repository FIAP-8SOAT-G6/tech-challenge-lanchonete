import Product from "../entities/Product";
import ProductDTO from "../dto/ProductDTO";
import ProductGateway from "../../gateways/ProductGateway";
import UpdateProduct from "../interfaces/UpdateProduct";
import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";

export default class UpdateProductUseCase implements UpdateProduct {
  constructor(private productGateway: ProductGateway) {}

  async updateProduct(productDTO: ProductDTO): Promise<ProductDTO> {
    const { id } = productDTO;
    const currentProductDTO = await this.productGateway.getByProductId(id!);
    if (!currentProductDTO) throw new ResourceNotFoundError(ResourceNotFoundError.Resources.Product, "id", id);

    const product = this.#toProductEntity(currentProductDTO);
    product.setName(productDTO.name!);
    product.setCategory(productDTO.category!);
    product.setDescription(productDTO.description!);
    product.setPrice(productDTO.price!);
    product.setImages(productDTO.images!);

    const updatedProductDTO = this.#toProductDTO(product);
    return (await this.productGateway.updateProduct(updatedProductDTO))!;
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
