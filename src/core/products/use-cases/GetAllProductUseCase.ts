import ProductDTO from "../dto/ProductDTO";
import ProductGateway from "../../interfaces/ProductGateway";
import GetAllProducts from "../interfaces/GetAllProducts";

export default class GetAllProductsUseCase implements GetAllProducts {
  constructor(private productGateway: ProductGateway) {}

  async getAllProducts(): Promise<ProductDTO[] | undefined> {
    const products = await this.productGateway.getAllProducts();
    if (!products || products.length === 0) return undefined;
    return products;
  }
}
