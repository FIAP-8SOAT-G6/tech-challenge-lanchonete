import ProductDTO from "../dto/ProductDTO";
import ProductGateway from "../../gateways/ProductGateways";
import GetAllProducts from "../interfaces/GetAllProducts";

export default class GetAllProductsUseCase implements GetAllProducts {
  constructor(private productGateway: ProductGateway) {}

  async getAllProducts(): Promise<ProductDTO[] | undefined> {
    const products = await this.productGateway.getAllProducts();
    if (!products) return undefined;
    return products;
  }
}
