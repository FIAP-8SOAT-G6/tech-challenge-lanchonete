import ProductDTO from "../../core/products/dto/ProductDTO";

export default interface ProductRepository {
  create(productDTO: ProductDTO): Promise<ProductDTO>;

  findAll(): Promise<ProductDTO[]>;

  findById(id: number): Promise<ProductDTO | undefined>;

  findByCategory(category: string): Promise<ProductDTO[]>;

  #findAllProducts(conditions?: any): Promise<ProductDTO[]>;


  update(productDTO: ProductDTO): Promise<ProductDTO>;

  delete(id: number);

  #addImages({
    productId,
    images
  }: {
    productId: number;
    images: string[];
  }): Promise<string>;

  #deleteImages(productId: number): Promise;
}
