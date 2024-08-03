const OrdersController = require("../../adapters/api/OrdersController");
const ProductsController = require("../../adapters/api/ProductsController");
const ProductManagement = require("../../core/products/use-cases/ProductManagement");
const SequelizeProductRepository = require("../../adapters/database/SequelizeProductRepository");

module.exports = class ControllerFactory {
  static makeProductManagementController() {
    return new ProductsController(
      new ProductManagement(new SequelizeProductRepository())
    );
  }

  static makeOrdersController() {
    return new OrdersController(
      // TODO vir aqui 
      new ProductManagement(new SequelizeProductRepository())
    );
  }
};
