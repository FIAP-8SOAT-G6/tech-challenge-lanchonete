import ProductDTO from "../dto/ProductDTO";
import ProductGateway from "../../interfaces/ProductGateway";
import GetByCategory from "../interfaces/GetByCategory";
import ProductCategory from "../entities/ProductCategory";
import InvalidCategoryError from "../exceptions/InvalidCategoryError";

export default class GetByCategoryUseCase implements GetByCategory {
  constructor(private productGateway: ProductGateway) {}

  async getByCategory(category: string): Promise<ProductDTO[] | undefined> {
    if (!Object.keys(ProductCategory).includes(category)) throw new InvalidCategoryError(category);
    const products = await this.productGateway.getByCategory(category);
    if (!products) return undefined;
    return products;
  }
}
