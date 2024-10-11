import OrdersController from "../../adapters/api/OrdersController";
import ProductsController from "../../adapters/api/ProductsController";
import SequelizeCustomerRepository from "../../adapters/database/SequelizeCustomerRepository";
import SequelizeOrderRepository from "../../adapters/database/SequelizeOrderRepository";
import SequelizeProductRepository from "../../adapters/database/SequelizeProductRepository";
import OrderManagement from "../../core/orders/use-cases/OrderManagement";
import ProductManagement from "../../core/products/use-cases/ProductManagement";

export default class ControllerFactory {
  static makeProductManagementController() {
    return new ProductsController(new ProductManagement(new SequelizeProductRepository()));
  }

  static makeOrdersController() {
    return new OrdersController(
      new OrderManagement(new SequelizeOrderRepository(), new SequelizeProductRepository(), new SequelizeCustomerRepository())
    );
  }
}
