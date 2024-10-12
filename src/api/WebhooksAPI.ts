import { Router } from "express";

import WebhookController from "../controllers/WebhookController";
import SequelizeOrderDataSource from "../external/SequelizeOrderDataSource";
import WebhookDTO from "../core/webhooks/dto/WebhookDTO";
import ResourceNotFoundError from "../core/common/exceptions/ResourceNotFoundError";

const webhooksAPIRouter = Router();

webhooksAPIRouter.post("/webhooks/payments", async (req, res) => {
  try {
    const { orderId, paymentStatus, timestamp } = req.body;  
    const webhookDTO = new WebhookDTO({ 
      orderId,
      paymentStatus,
      timestamp
    });
    const order = await WebhookController.process(new SequelizeOrderDataSource(), webhookDTO);
    
    return res.status(200).json(order);
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

export default webhooksAPIRouter;
