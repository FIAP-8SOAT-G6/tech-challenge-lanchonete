const { Router } = require("express");
const InvalidCategoryError = require("../../core/products/exceptions/InvalidCategoryError");
const MissingPropertyError = require("../../core/products/exceptions/MissingPropertyError");
const UnexistingProductError = require("../../core/products/exceptions/UnexistingProductError");

class OrdersController {
  constructor(orderUseCase) {
    this.router = new Router();
    this.useCase = orderUseCase;

    this.initializeRoutes();
  }

  getRouter() {
    return this.router;
  }

  initializeRoutes() {
    this.router.get("/orders", async (req, res) => {
      // const { name, description, category, price } = req.body;
      // const order = await this.useCase.create({});
    
      return res.status(201).json(
        { 'xunda': 'loxa' }
      );
    })
  }
}

module.exports = OrdersController;
