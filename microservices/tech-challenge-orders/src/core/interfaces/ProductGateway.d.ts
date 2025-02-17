import ProductDTO from "../products/dto/ProductDTO";

export default interface ProductGateway {
  getByProductId(id: number): Promise<ProductDTO | undefined>;
}
