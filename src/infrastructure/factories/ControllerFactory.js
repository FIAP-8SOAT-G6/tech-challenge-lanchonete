const OrdersController = require("../../adapters/api/OrdersController");
const ProductsController = require("../../adapters/api/ProductsController");
const ProductManagement = require("../../core/products/use-cases/ProductManagement");
const SequelizeProductRepository = require("../../adapters/database/SequelizeProductRepository");
const SequelizeOrderRepository = require("../../adapters/database/SequelizeOrderRepository");
const OrderManagement = require("../../core/orders/use-cases/OrderManagement");
const CustomerController = require("../../adapters/api/CustomerController");
const CustomerManagement = require("../../core/customers/use-cases/CustomerManagement");
const SequelizeCustomerRepository = require("../../adapters/database/SequelizeCustomerRepository");

module.exports = class ControllerFactory {
  static makeProductManagementController() {
    return new ProductsController(
      new ProductManagement(new SequelizeProductRepository())
    );
  }

  static makeOrdersController() {
    return new OrdersController(
      new OrderManagement(
        new SequelizeOrderRepository(),
        new SequelizeProductRepository()
      )
    );
  }

  static makeCustomerManagementController() {
    return new CustomerController(
      new CustomerManagement(new SequelizeCustomerRepository())
    );
  }
};
