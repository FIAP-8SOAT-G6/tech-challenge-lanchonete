import ProductsController from "../../adapters/api/ProductsController";
import ProductManagement from "../../core/products/use-cases/ProductManagement";
import SequelizeProductRepository from "../../adapters/database/SequelizeProductRepository";
export default class ControllerFactory {
  static makeProductManagementController() {
    return new ProductsController(new ProductManagement(new SequelizeProductRepository()));
  }
}
