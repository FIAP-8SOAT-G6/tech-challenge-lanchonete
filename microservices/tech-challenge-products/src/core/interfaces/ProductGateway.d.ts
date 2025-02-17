import ProductDTO from "../products/dto/ProductDTO";

export default interface ProductGateway {
  getAllProducts(): Promise<ProductDTO[]>;
  getByProductId(id: number): Promise<ProductDTO | undefined>;
  getByCategory(category: string): Promise<ProductDTO[]>;

  createProduct(productDTO: ProductDTO): Promise<ProductDTO>;
  updateProduct(productDTO: ProductDTO): Promise<ProductDTO | undefined>;
  deleteProduct(id: number);
}
