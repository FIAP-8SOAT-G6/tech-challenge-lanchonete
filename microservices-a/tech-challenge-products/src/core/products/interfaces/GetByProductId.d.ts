import ProductDTO from "../dto/ProductDTO";

export default interface GetByProductId {
  getByProductId(id: number): Promise<ProductDTO>;
}
