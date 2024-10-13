import { Router } from "express";

import WebhookController from "../controllers/WebhookController";
import SequelizeOrderDataSource from "../external/SequelizeOrderDataSource";
import PaymentDTO from "../core/webhooks/dto/PaymentDTO";
import ResourceNotFoundError from "../core/common/exceptions/ResourceNotFoundError";

const webhooksAPIRouter = Router();

webhooksAPIRouter.post("/webhooks/payments", async (req, res) => {
  try {
    const { orderId, paymentStatus, timestamp } = req.body;  
    const paymentDTO = new PaymentDTO({ 
      orderId,
      paymentStatus,
      timestamp
    });
    const order = await WebhookController.process(new SequelizeOrderDataSource(), paymentDTO);
    
    return res.status(200).json(order);
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

export default webhooksAPIRouter;
