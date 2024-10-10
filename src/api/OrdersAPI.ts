import { Router } from "express";

import OrderController from "../controllers/OrderController";
import OrderDTO from "../core/orders/dto/OrderDTO";
//import ItemDTO from "../core/orders/dto/ItemDTO";
import SequelizeOrderDataSource from "../external/SequelizeOrderDataSource";

//import EmptyOrderError from "../core/orders/exceptions/EmptyOrderError";
//import ClosedOrderError from "../core/orders/exceptions/ClosedOrderError";
import ResourceNotFoundError from "../core/common/exceptions/ResourceNotFoundError";
import SequelizeCustomerDataSource from "../external/SequelizeCustomerDataSource";

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

// ordersAPIRouter.get("/orders", async (req, res) => {
//   try {
//     const orders = await await OrderController.getOrdersByPriority();
//     return res.status(200).json(orders);
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// });

// ordersAPIRouter.get("/orders/all", async (req, res) => {
//   try {
//     const order = await OrderController.getOrders();
//     return res.status(200).json(order);
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// });

// ordersAPIRouter.get("/orders/:orderId", async (req, res) => {
//   try {
//     const orderId = Number(req.params.orderId);
//     const order = await OrderController.getOrder(orderId);
//     return res.status(201).json(order);
//   } catch (error: any) {
//     if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
//     return res.status(500).json({ error: error.message });
//   }
// });

// ordersAPIRouter.post("/orders/:orderId/items", async (req, res) => {
//   try {
//     const orderId = Number(req.params.orderId);
//     const { productId, quantity } = req.body;
//     const addItemDTO = new ItemDTO({ productId, quantity });
//     const order = await OrderController.addItem(orderId, addItemDTO);
//     return res.status(201).json(order);
//   } catch (error: any) {
//     if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
//     if (error instanceof ClosedOrderError) return res.status(400).json({ error: error.message });
//     return res.status(500).json({ error: error.message });
//   }
// });

// ordersAPIRouter.delete("/orders/:orderId/items/:itemId", async (req, res) => {
//   try {
//     const { orderId, itemId } = req.params;
//     await OrderController.removeItem(Number(orderId), Number(itemId));
//     return res.status(204).json({});
//   } catch (error: any) {
//     if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
//     if (error instanceof ClosedOrderError) return res.status(400).json({ error: error.message });
//     return res.status(500).json({ error: error.message });
//   }
// });

// ordersAPIRouter.put("/orders/:orderId/items/:itemId", async (req, res) => {
//   try {
//     const { orderId, itemId } = req.params;
//     const { quantity } = req.body;
//     const updateItemDTO = new ItemDTO({ quantity });
//     const orderUpdated = await OrderController.updateItem(Number(orderId), Number(itemId), updateItemDTO);
//     return res.status(200).json(orderUpdated);
//   } catch (error: any) {
//     if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
//     if (error instanceof ClosedOrderError) return res.status(400).json({ error: error.message });
//     return res.status(500).json({ error: error.message });
//   }
// });

// ordersAPIRouter.post("/orders/:orderId/checkout", async (req, res) => {
//   try {
//     const orderId = Number(req.params.orderId);
//     await OrderController.checkout(orderId);
//     return res.status(200).json({});
//   } catch (error: any) {
//     if (error instanceof EmptyOrderError) return res.status(400).json({ error: error.message });
//     return res.status(500).json({ error: error.message });
//   }
// });

// ordersAPIRouter.post("/orders/:orderId/status", async (req, res) => {
//   try {
//     const orderId = req.params.orderId;
//     const { status } = req.body;
//     await OrderController.updateOrderStatus({ orderId, status });
//     return res.status(200).json({});
//   } catch (error) {
//     if (error instanceof EmptyOrderError) return res.status(400).json({ error: error.message });
//     return res.status(500).json({ error: error.message });
//   }
// });

export default ordersAPIRouter;
