import ProductDTO from "../core/products/dto/ProductDTO";
import { ProductsFactory } from "../factories/ProductsFactory";
import { ProductDataSource } from "../interfaces/DataSources";
import ProductPresenter, { ProductResponse } from "../presenters/ProductPresenter";

export default class ProductController {
  public static async getAllProducts(productDataSource: ProductDataSource): Promise<ProductResponse[]> {
    const useCase = ProductsFactory.makeGetAllProduct(productDataSource);
    const products = await useCase.getAllProducts();
    return ProductPresenter.adaptProductsData(products);
  }

  public static async getByProductId(productDataSource: ProductDataSource, id: number): Promise<ProductResponse> {
    const useCase = ProductsFactory.makeGetById(productDataSource);
    const createdCustomer = await useCase.getByProductId(id);
    return ProductPresenter.adaptProductData(createdCustomer);
  }
  public static async create(productDataSource: ProductDataSource, product: ProductDTO): Promise<ProductResponse> {
    const useCase = ProductsFactory.makeCreateProduct(productDataSource);
    const createdCustomer = await useCase.createProduct(product);
    return ProductPresenter.adaptProductData(createdCustomer);
  }

  public static async update(productDataSource: ProductDataSource, product: ProductDTO): Promise<ProductResponse> {
    const useCase = ProductsFactory.makeUpdate(productDataSource);
    const createdCustomer = await useCase.updateProduct(product);
    return ProductPresenter.adaptProductData(createdCustomer);
  }

  public static async delete(productDataSource: ProductDataSource, id: number): Promise<any> {
    const useCase = ProductsFactory.makeDelete(productDataSource);
    await useCase.deleteProduct(id);
    return;
  }

  public static async getByCategory(productDataSource: ProductDataSource, category: string): Promise<ProductResponse[]> {
    const useCase = ProductsFactory.makeGetByCategory(productDataSource);
    const createdCustomer = await useCase.getByCategory(category);
    return ProductPresenter.adaptProductsData(createdCustomer);
  }
}
