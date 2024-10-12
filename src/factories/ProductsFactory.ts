import { ProductDataSource } from "../interfaces/DataSources";
import ProductGateway from "../gateways/ProductGateway";
import CreateProduct from "../core/products/interfaces/CreateProduct";
import DeleteProduct from "../core/products/interfaces/DeleteProduct";
import GetAllProducts from "../core/products/interfaces/GetAllProducts";
import GetByCategory from "../core/products/interfaces/GetByCategory";
import GetByProductId from "../core/products/interfaces/GetByProductId";
import UpdateProduct from "../core/products/interfaces/UpdateProduct";
import CreateProductUseCase from "../core/products/use-cases/CreateProductUseCase";
import DeleteProductUseCase from "../core/products/use-cases/DeleteProductUseCase";
import GetAllProductsUseCase from "../core/products/use-cases/GetAllProductUseCase";
import GetByCategoryUseCase from "../core/products/use-cases/GetByCategoryUseCase";
import GetByProductIdUseCase from "../core/products/use-cases/GetByProductIdUseCase";
import UpdateProductUseCase from "../core/products/use-cases/UpdateProductUseCase";

export class ProductsFactory {
  public static makeGetAllProduct(dataSource: ProductDataSource): GetAllProducts {
    return new GetAllProductsUseCase(new ProductGateway(dataSource));
  }

  public static makeGetById(dataSource: ProductDataSource): GetByProductId {
    return new GetByProductIdUseCase(new ProductGateway(dataSource));
  }

  public static makeCreateProduct(dataSource: ProductDataSource): CreateProduct {
    return new CreateProductUseCase(new ProductGateway(dataSource));
  }

  public static makeUpdate(dataSource: ProductDataSource): UpdateProduct {
    return new UpdateProductUseCase(new ProductGateway(dataSource));
  }

  public static makeDelete(dataSource: ProductDataSource): DeleteProduct {
    return new DeleteProductUseCase(new ProductGateway(dataSource));
  }

  public static makeGetByCategory(dataSource: ProductDataSource): GetByCategory {
    return new GetByCategoryUseCase(new ProductGateway(dataSource));
  }
}
