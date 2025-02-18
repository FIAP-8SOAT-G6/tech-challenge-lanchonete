import ProductDTO from "../dto/ProductDTO";

export default interface GetByCategory {
  getByCategory(category: string): Promise<ProductDTO[] | undefined>;
}
