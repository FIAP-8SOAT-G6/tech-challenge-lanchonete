import { ProductDataSource } from "../interfaces/DataSources";
import ProductGatewayInterface from "../core/interfaces/ProductGateway";
import ProductDTO from "../core/products/dto/ProductDTO";

export default class ProductGateway implements ProductGatewayInterface {
  constructor(private dataSource: ProductDataSource) {}

  async getAllProducts(): Promise<ProductDTO[]> {
    const products = await this.dataSource.findAll();
    return products || [];
  }

  async getByProductId(id: number): Promise<ProductDTO | undefined> {
    const product = await this.dataSource.findById(id);
    if (!product) return undefined;
    return product;
  }

  async getByCategory(category: string): Promise<ProductDTO[]> {
    const products = await this.dataSource.findByCategory(category);
    return products || [];
  }

  async createProduct(productDTO: ProductDTO): Promise<ProductDTO> {
    const createdProduct = await this.dataSource.create(productDTO);
    return createdProduct;
  }

  async updateProduct(productDTO: ProductDTO): Promise<ProductDTO | undefined> {
    const updatedProduct = await this.dataSource.update(productDTO);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.dataSource.delete(id);
    return undefined;
  }
}
