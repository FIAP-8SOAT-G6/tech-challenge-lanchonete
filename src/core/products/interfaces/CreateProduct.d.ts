import ProductDTO from "../dto/ProductDTO";

export default interface CreateProduct {
  createProduct(productDTO: ProductDTO): Promise<ProductDTO>;
}
