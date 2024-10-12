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

const webhooksRouter = Router();

webhooksRouter.post("/webhooks/payments", async (req, res) => {
    try {
      return res.status(200).json({ 'xunda': 'loxa'});
    } catch (error: any) {
      if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
      return res.status(500).json({ error: error.message });
    }
  });
