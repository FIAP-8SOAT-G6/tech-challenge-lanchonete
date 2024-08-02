const ProductsController = require("../../adapters/api/ProductsController");
const ProductManagement = require("../../core/use-cases/ProductManagement");
const SequelizeProductRepository = require("../../adapters/database/SequelizeProductRepository");

module.exports = class ControllerFactory {
  static makeProductManagementController() {
    return new ProductsController(
      new ProductManagement(new SequelizeProductRepository())
    );
  }
};
