const { Router } = require("express");
const UnexistingOrderError = require("../../core/orders/exceptions/UnexistingOrderError");
const UnexistingProductError = require("../../core/products/exceptions/UnexistingProductError");
const UnexistingItemError = require("../../core/orders/exceptions/UnexistingItemError");

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

    this.router.get("/orders", async (req, res) => {
      try {
        const order = await this.useCase.getOrders();
        return res.status(200).json(order);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    });

    this.router.get("/orders/:id", async (req, res) => {
      try {
        const orderId = req.params.id;
        const order = await this.useCase.getOrder(orderId);
        return res.status(201).json(order);
      } catch (error) {
        if (error instanceof UnexistingOrderError)
          return res.status(404).json({ error: error.message });
        return res.status(500).json({ error: error.message });
      }
    });

    this.router.post("/orders/:id/items", async (req, res) => {
      try {
        const orderId = req.params.id;
        const { productId, quantity } = req.body;
        const order = await this.useCase.addItem(orderId, {
          productId,
          quantity
        });
        return res.status(201).json(order);
      } catch (error) {
        if (error instanceof UnexistingOrderError)
          return res.status(404).json({ error: error.message });
        if (error instanceof UnexistingProductError)
          return res.status(400).json({ error: error.message });
        return res.status(500).json({ error: error.message });
      }
    });

    this.router.delete("/orders/:orderId/items/:itemId", async (req, res) => {
      try {
        const { orderId, itemId } = req.params;
        await this.useCase.removeItem(orderId, itemId);
        return res.status(204).json({});
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    });

    this.router.put("/orders/:orderId/items/:itemId", async (req, res) => {
      try {
        const { orderId, itemId } = req.params;
        const { quantity } = req.body;
        const updatedOrder = await this.useCase.updateItem(
          Number(orderId),
          Number(itemId),
          {
            quantity
          }
        );
        return res.status(200).json(updatedOrder);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    });
  }
}

module.exports = OrdersController;
