const CustomerController = require("../../adapters/api/CustomerController");
const OrdersController = require("../../adapters/api/OrdersController");
const ProductsController = require("../../adapters/api/ProductsController");

const CustomerManagement = require("../../core/customers/use-cases/CustomerManagement");
const OrderManagement = require("../../core/orders/use-cases/OrderManagement");
const ProductManagement = require("../../core/products/use-cases/ProductManagement");

const SequelizeCustomerRepository = require("../../adapters/database/SequelizeCustomerRepository");
const SequelizeOrderRepository = require("../../adapters/database/SequelizeOrderRepository");
const SequelizeProductRepository = require("../../adapters/database/SequelizeProductRepository");

const CPFValidatorAdapter = require("../../adapters/services/validators/CPFValidatorAdapter");
const EmailValidatorAdapter = require("../../adapters/services/validators/EmailValidatorAdapter");

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
        new SequelizeProductRepository(),
        new SequelizeCustomerRepository()
      )
    );
  }

  static makeCustomerManagementController() {
    return new CustomerController(
      new CustomerManagement(
        new SequelizeCustomerRepository(),
        new CPFValidatorAdapter(),
        new EmailValidatorAdapter()
      )
    );
  }
};
