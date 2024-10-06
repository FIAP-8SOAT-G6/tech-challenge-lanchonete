import ProductDTO from "../../core/products/dto/ProductDTO";

export default interface ProductRepository {
  create(productDTO: ProductDTO): Promise<ProductDTO>;

  findAll(): Promise<ProductDTO[]>;

  findById(id: number): Promise<ProductDTO | undefined>;

  findByCategory(category: string): Promise<ProductDTO[]>;

  update(productDTO: ProductDTO): Promise<ProductDTO | undefined>;

  delete(id: number);
}
