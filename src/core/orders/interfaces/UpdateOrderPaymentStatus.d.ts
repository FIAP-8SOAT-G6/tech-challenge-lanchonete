import WebhookDTO from "../../webhooks/dto/WebhookDTO";

export default interface UpdateOrderPaymentStatus {
  updateOrderPaymentStatus(webhookDTO: WebhookDTO): Promise<OrderDTO>;
}
