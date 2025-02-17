import ProductGatewayInterface from "../core/interfaces/ProductGateway";
import ProductDTO from "../core/products/dto/ProductDTO";
import { ProductsSource } from "../interfaces/ProductsSource";

export default class ProductGateway implements ProductGatewayInterface {
  constructor(private dataSource: ProductsSource) {}
 
  async getByProductId(id: number): Promise<ProductDTO | undefined> {
    const product = await this.dataSource.findById(id);
    if (!product) return undefined;
    return product;
  }
}
