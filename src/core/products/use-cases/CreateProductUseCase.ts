import ProductDTO from "../dto/ProductDTO";
import CreateProduct from "../interfaces/CreateProduct";
import ProductGateway from "../../interfaces/ProductGateway";
import ProductMapper from "../mappers/ProductMapper";

export default class CreateProductUseCase implements CreateProduct {
  constructor(private productGateway: ProductGateway) {}

  async createProduct(productDTO: ProductDTO): Promise<ProductDTO> {
    const product = ProductMapper.toProductEntity(productDTO);
    return await this.productGateway.createProduct(ProductMapper.toProductDTO(product));
  }
}
