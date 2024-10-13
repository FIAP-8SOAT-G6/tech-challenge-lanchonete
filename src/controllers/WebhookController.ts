import { WebhooksFactory } from "../factories/WebhooksFactory";
import WebhookDTO from "../core/webhooks/dto/WebhookDTO";
import { OrderDataSource } from "../interfaces/DataSources";
import OrderPresenter, { OrderResponse } from "../presenters/OrderPresenters";

export default class WebhookController {
  public static async process(orderDataSource: OrderDataSource, webhookDTO: WebhookDTO): Promise<OrderResponse> {
    const useCase = WebhooksFactory.process(orderDataSource);
    const updatedOrder = await useCase.updateOrderPaymentStatus(webhookDTO);

    return OrderPresenter.adaptOrderData(updatedOrder);
  }
}
