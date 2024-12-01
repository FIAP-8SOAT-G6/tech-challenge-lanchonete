import { Router } from "express";

import WebhookController from "../controllers/WebhookController";
import SequelizeOrderDataSource from "../external/SequelizeOrderDataSource";
import PaymentDTO from "../core/orders/dto/PaymentDTO";
import ResourceNotFoundError from "../core/common/exceptions/ResourceNotFoundError";
import { MercadoPagoPaymentSystem } from "../external/MercadoPagoPaymentSystem";

const webhooksAPIRouter = Router();

export const WEBHOOK_PATH = "/webhooks";

const SUPPORTED_TOPICS = {
  Payment: "payment"
};

webhooksAPIRouter.post(WEBHOOK_PATH, async (req, res) => {
  try {
    const { topic, id } = req.query;

    if (topic === SUPPORTED_TOPICS.Payment) {
      console.log(`Webhook entrypoint ` + topic, id);
      const paymentDTO = new PaymentDTO({
        paymentId: Number(id)
      });
      await WebhookController.processPayment(new SequelizeOrderDataSource(), new MercadoPagoPaymentSystem(), paymentDTO);

      return res.status(200).json({});
    }

    return res.status(400).json({});
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

export default webhooksAPIRouter;
