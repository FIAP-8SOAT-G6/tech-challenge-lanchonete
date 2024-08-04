const { Router } = require("express");

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
    this.router.post("/orders", async (req, res) => {
      const { items } = req.body;
      const order = await this.useCase.create(items);
    
      return res.status(201).json(order);
    });
  }
}

module.exports = OrdersController;
