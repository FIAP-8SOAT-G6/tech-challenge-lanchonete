import ProductDTO from "../products/dto/ProductDTO";

export default interface ProductGateway {
  getAllProducts(): Promise<ProductDTO[] | undefined>;
  getByProductId(id: number): Promise<ProductDTO | undefined>;
  getByCategory(category: string): Promise<ProductDTO[] | undefined>;

  createProduct(productDTO: ProductDTO): Promise<ProductDTO>;
  updateProduct(productDTO: ProductDTO): Promise<ProductDTO | undefined>;
  deleteProduct(id: number);
}
