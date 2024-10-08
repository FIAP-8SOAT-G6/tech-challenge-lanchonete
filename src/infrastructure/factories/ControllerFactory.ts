import OrdersController from "../../adapters/api/OrdersController";
import ProductsController from "../../adapters/api/ProductsController";
import ProductManagement from "../../core/products/use-cases/ProductManagement";
import SequelizeProductRepository from "../../adapters/database/SequelizeProductRepository";
import SequelizeOrderRepository from "../../adapters/database/SequelizeOrderRepository";
import OrderManagement from "../../core/orders/use-cases/OrderManagement";
import CustomerController from "../../adapters/api/CustomerController";
import CustomerManagement from "../../core/customers/use-cases/CustomerManagement";
import SequelizeCustomerRepository from "../../adapters/database/SequelizeCustomerRepository";
import EmailValidatorAdapter from "../../adapters/services/validators/EmailValidatorAdapter";
import CPFValidatorAdapter from "../../adapters/services/validators/CPFValidatorAdapter";

export default class ControllerFactory {
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
}
