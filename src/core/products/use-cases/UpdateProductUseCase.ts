import ProductDTO from "../dto/ProductDTO";
import ProductGateway from "../../interfaces/ProductGateway";
import UpdateProduct from "../interfaces/UpdateProduct";
import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import { ProductMapper } from "../mappers/ProductMapper";

export default class UpdateProductUseCase implements UpdateProduct {
  constructor(private productGateway: ProductGateway) {}

  async updateProduct(productDTO: ProductDTO): Promise<ProductDTO> {
    const { id } = productDTO;
    const currentProductDTO = await this.productGateway.getByProductId(id!);
    if (!currentProductDTO) throw new ResourceNotFoundError(ResourceNotFoundError.Resources.Product, "id", id);

    const product = ProductMapper.toProductEntity(currentProductDTO);
    product.setName(productDTO.name!);
    product.setCategory(productDTO.category!);
    product.setDescription(productDTO.description!);
    product.setPrice(productDTO.price!);
    product.setImages(productDTO.images!);

    const updatedProductDTO = ProductMapper.toProductDTO(product);
    return (await this.productGateway.updateProduct(updatedProductDTO))!;
  }
}
