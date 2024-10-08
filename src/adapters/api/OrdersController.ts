import { Router } from "express";

import EmptyOrderError from "../../core/orders/exceptions/EmptyOrderError";
import ClosedOrderError from "../../core/orders/exceptions/ClosedOrderError";
import ResourceNotFoundError from "../../core/common/exceptions/ResourceNotFoundError";

import ItemDTO from "../../core/orders/dto/ItemDTO";
import OrderDTO from "../../core/orders/dto/OrderDTO";
import OrderManagementPort from "../../core/ports/OrderManagement";

export default class OrdersController {
  private useCase: OrderManagementPort;
  private router: Router;

  constructor(orderUseCase: OrderManagementPort) {
    this.router = Router();
    this.useCase = orderUseCase;

    this.initializeRoutes();
  }

  getRouter() {
    return this.router;
  }

  initializeRoutes() {
    this.router.post("/orders", async (req, res) => {
      try {
        const orderDTO = new OrderDTO({ customerId: req.body.customerId });
        const order = await this.useCase.create(orderDTO);
        return res.status(201).json(order);
      } catch (error: any) {
        if (error instanceof ResourceNotFoundError) return res.status(400).json({ error: error.message });
        return res.status(500).json({ error: error.message });
      }
    });

    this.router.get("/orders", async (req, res) => {
      try {
        const order = await this.useCase.getOrdersByPriority();
        return res.status(200).json(order);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    });

    this.router.get("/orders/all", async (req, res) => {
      try {
        const order = await this.useCase.getOrders();
        return res.status(200).json(order);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    });

    this.router.get("/orders/:orderId", async (req, res) => {
      try {
        const orderId = Number(req.params.orderId);
        const order = await this.useCase.getOrder(orderId);
        return res.status(201).json(order);
      } catch (error: any) {
        if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
        return res.status(500).json({ error: error.message });
      }
    });

    this.router.post("/orders/:orderId/items", async (req, res) => {
      try {
        const orderId = Number(req.params.orderId);
        const { productId, quantity } = req.body;
        const addItemDTO = new ItemDTO({ productId, quantity });
        const order = await this.useCase.addItem(orderId, addItemDTO);
        return res.status(201).json(order);
      } catch (error: any) {
        if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
        if (error instanceof ClosedOrderError) return res.status(400).json({ error: error.message });
        return res.status(500).json({ error: error.message });
      }
    });

    this.router.delete("/orders/:orderId/items/:itemId", async (req, res) => {
      try {
        const { orderId, itemId } = req.params;
        await this.useCase.removeItem(Number(orderId), Number(itemId));
        return res.status(204).json({});
      } catch (error: any) {
        if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
        if (error instanceof ClosedOrderError) return res.status(400).json({ error: error.message });
        return res.status(500).json({ error: error.message });
      }
    });

    this.router.put("/orders/:orderId/items/:itemId", async (req, res) => {
      try {
        const { orderId, itemId } = req.params;
        const { quantity } = req.body;
        const updateItemDTO = new ItemDTO({ quantity });
        const updatedOrder = await this.useCase.updateItem(Number(orderId), Number(itemId), updateItemDTO);
        return res.status(200).json(updatedOrder);
      } catch (error: any) {
        if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
        if (error instanceof ClosedOrderError) return res.status(400).json({ error: error.message });
        return res.status(500).json({ error: error.message });
      }
    });

    this.router.post("/orders/:orderId/checkout", async (req, res) => {
      try {
        const orderId = Number(req.params.orderId);
        await this.useCase.checkout(orderId);
        return res.status(200).json({});
      } catch (error: any) {
        if (error instanceof EmptyOrderError) return res.status(400).json({ error: error.message });
        return res.status(500).json({ error: error.message });
      }
    });
  }
}
