import ProductDTO from "../products/dto/ProductDTO";

export default interface ProductManagement {
  create(productDTO: ProductDTO): Promise<ProductDTO>;

  findAll(): Promise<ProductDTO[]>;

  findById(id: number): Promise<ProductDTO>;

  findByCategory(category: string): Promise<ProductDTO[]>;

  update(productDTO: ProductDTO): Promise<ProductDTO>;

  delete(id: number): Promise<undefined>;
}
