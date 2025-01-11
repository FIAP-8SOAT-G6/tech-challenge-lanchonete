import ProductDTO from "../dto/ProductDTO";

export default interface GetAllProducts {
  getAllProducts(): Promise<ProductDTO[] | []>;
}
