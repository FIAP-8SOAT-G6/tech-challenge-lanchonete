const ProductsController = require('../../adapters/api/ProductsController');
const ProductManagement = require('../../core/products/use-cases/ProductManagement');
const SequelizeProductRepository = require('../../adapters/database/SequelizeProductRepository');
const CustomerController = requie('../../adapters/api/CustomerController');
const CustomerManagement = requie(
  '../../core/customers/use-cases/CustomerManagement'
);
const SequelizeCustomerRepository = requie(
  '../../adapters/database/SequelizeCustomerRepository'
);

module.exports = class ControllerFactory {
  static makeProductManagementController() {
    return new ProductsController(
      new ProductManagement(new SequelizeProductRepository())
    );
  }

  static makeCustomerManagementController() {
    return new CustomerController(
      new CustomerManagement(new SequelizeCustomerRepository())
    );
  }
};
