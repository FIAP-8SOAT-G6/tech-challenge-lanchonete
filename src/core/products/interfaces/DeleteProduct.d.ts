import ProductDTO from "../dto/ProductDTO";

export default interface DeleteProduct {
  deleteProduct(id: number): Promise<undefined>;
}
