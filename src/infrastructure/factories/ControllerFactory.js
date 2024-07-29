const ProductManagementController = require("../../adapters/api/ProductManagementController");
const ProductManagement = require("../../core/use-cases/ProductManagement");
const SequelizeProductRepository = require("../../adapters/database/SequelizeProductRepository");

module.exports = class ControllerFactory {
  static makeProductManagementController() {
    return new ProductManagementController(
      new ProductManagement(new SequelizeProductRepository())
    );
  }
};
