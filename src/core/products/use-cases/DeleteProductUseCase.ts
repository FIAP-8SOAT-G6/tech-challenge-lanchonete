import ProductGateway from "../../interfaces/ProductGateway";
import DeleteProduct from "../interfaces/DeleteProduct";

export default class DeleteProductUseCase implements DeleteProduct {
  constructor(private productGateway: ProductGateway) {}

  async deleteProduct(id: number): Promise<undefined> {
    await this.productGateway.deleteProduct(id);
  }
}
