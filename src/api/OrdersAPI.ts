import { Router } from "express";

import OrderController from "../controllers/OrderController";
import OrderDTO from "../core/orders/dto/OrderDTO";
import SequelizeOrderDataSource from "../external/SequelizeOrderDataSource";
import ResourceNotFoundError from "../core/common/exceptions/ResourceNotFoundError";
import SequelizeCustomerDataSource from "../external/SequelizeCustomerDataSource";
import SequelizeProductDataSource from "../external/SequelizeProductDataSource";
import ItemDTO from "../core/orders/dto/ItemDTO";
import ClosedOrderError from "../core/orders/exceptions/ClosedOrderError";
import EmptyOrderError from "../core/orders/exceptions/EmptyOrderError";
import { MercadoPagoPaymentSystem } from "../external/MercadoPagoPaymentSystem";

const ordersAPIRouter = Router();

ordersAPIRouter.post("/orders", async (req, res) => {
  try {
    const orderDTO = new OrderDTO({ customerId: req.body.customerId });
    const orderCreated = await OrderController.createOrder(new SequelizeOrderDataSource(), new SequelizeCustomerDataSource(), orderDTO);
    return res.status(201).json(orderCreated);
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.get("/orders", async (req, res) => {
  try {
    const orders = await OrderController.getOrders(new SequelizeOrderDataSource());
    return res.status(200).json(orders);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.get("/orders/all", async (req, res) => {
  try {
    const order = await OrderController.getOrdersAll(new SequelizeOrderDataSource());
    return res.status(200).json(order);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.get("/orders/:orderId", async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);
    const order = await OrderController.getOrder(new SequelizeOrderDataSource(), orderId);
    return res.status(201).json(order);
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.post("/orders/:orderId/checkout", async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);
    const checkoutResponse = await OrderController.checkout(new SequelizeOrderDataSource(), new MercadoPagoPaymentSystem(), orderId);
    return res.status(200).json(checkoutResponse);
  } catch (error: any) {
    if (error instanceof EmptyOrderError) return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.get("/orders/:orderId/payment_status", async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);
    const status = await OrderController.getPaymentStatus(new SequelizeOrderDataSource(), orderId);
    return res.status(200).json(status);
  } catch (error: any) {
    if (error instanceof EmptyOrderError) return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.post("/orders/:orderId/status", async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);
    const { status } = req.body;
    const order = await OrderController.updateOrderStatus(new SequelizeOrderDataSource(), orderId, status);
    return res.status(200).json(order);
  } catch (error: any) {
    if (error instanceof EmptyOrderError) return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.post("/orders/:orderId/items", async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);
    const { productId, quantity } = req.body;
    const addItemDTO = new ItemDTO({ productId, quantity });
    const order = await OrderController.addItem(new SequelizeOrderDataSource(), new SequelizeProductDataSource(), orderId, addItemDTO);
    return res.status(201).json(order);
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
    if (error instanceof ClosedOrderError) return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.put("/orders/:orderId/items/:itemId", async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { quantity } = req.body;
    const updateItemDTO = new ItemDTO({ quantity });
    const orderUpdated = await OrderController.updateItem(new SequelizeOrderDataSource(), Number(orderId), Number(itemId), updateItemDTO);
    return res.status(200).json(orderUpdated);
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
    if (error instanceof ClosedOrderError) return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.delete("/orders/:orderId/items/:itemId", async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    await OrderController.deleteItem(new SequelizeOrderDataSource(), Number(orderId), Number(itemId));
    return res.status(204).json({});
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
    if (error instanceof ClosedOrderError) return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

export default ordersAPIRouter;
