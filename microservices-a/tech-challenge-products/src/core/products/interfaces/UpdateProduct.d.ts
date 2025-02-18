import ProductDTO from "../dto/ProductDTO";

export default interface UpdateProduct {
  updateProduct(productDTO: ProductDTO): Promise<ProductDTO>;
}
