"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OrdersController_1 = __importDefault(require("../../adapters/api/OrdersController"));
const ProductsController_1 = __importDefault(require("../../adapters/api/ProductsController"));
const ProductManagement_1 = __importDefault(require("../../core/products/use-cases/ProductManagement"));
const SequelizeProductRepository_1 = __importDefault(require("../../adapters/database/SequelizeProductRepository"));
const SequelizeOrderRepository_1 = __importDefault(require("../../adapters/database/SequelizeOrderRepository"));
const OrderManagement_1 = __importDefault(require("../../core/orders/use-cases/OrderManagement"));
const CustomerController_1 = __importDefault(require("../../adapters/api/CustomerController"));
const CustomerManagement_1 = __importDefault(require("../../core/customers/use-cases/CustomerManagement"));
const SequelizeCustomerRepository_1 = __importDefault(require("../../adapters/database/SequelizeCustomerRepository"));
class ControllerFactory {
    static makeProductManagementController() {
        return new ProductsController_1.default(new ProductManagement_1.default(new SequelizeProductRepository_1.default()));
    }
    static makeOrdersController() {
        return new OrdersController_1.default(new OrderManagement_1.default(new SequelizeOrderRepository_1.default(), new SequelizeProductRepository_1.default(), new SequelizeCustomerRepository_1.default()));
    }
    static makeCustomerManagementController() {
        return new CustomerController_1.default(new CustomerManagement_1.default(new SequelizeCustomerRepository_1.default()));
    }
}
exports.default = ControllerFactory;
;
