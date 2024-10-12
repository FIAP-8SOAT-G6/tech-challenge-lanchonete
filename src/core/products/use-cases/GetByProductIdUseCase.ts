import ProductDTO from "../dto/ProductDTO";
import ProductGateway from "../../interfaces/ProductGateway";
import GetByProductId from "../interfaces/GetByProductId";
import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";

export default class GetByProductIdUseCase implements GetByProductId {
  constructor(private productGateway: ProductGateway) {}

  async getByProductId(id: number): Promise<ProductDTO> {
    const product = await this.productGateway.getByProductId(id);
    if (!product) throw new ResourceNotFoundError(ResourceNotFoundError.Resources.Product, "id", id);

    return product;
  }
}
