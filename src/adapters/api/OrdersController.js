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
      try {
        // const { status, items } = req.body;
        const order = await this.useCase.create(req.body);
        res.status(201).json(order);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }
}

module.exports = OrdersController;
