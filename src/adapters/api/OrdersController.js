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
        const order = await this.useCase.create();
        return res.status(201).json(order);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    });

    this.router.post("/orders/:id/items", async (req, res) => {
      try {
        const orderId = req.params.id;
        const { productId, quantity } = req.body;
        const order = await this.useCase.addItem(orderId, {
          productId,
          quantity,
        });
        return res.status(201).json(order);
      } catch (error) {
        console.log(error.stack)
        return res.status(500).json({ error: error.message });
      }
    });
  }
}

module.exports = OrdersController;
