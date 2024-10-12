import { WebhooksFactory } from "../factories/WebhooksFactory";
import OrderPresenter from "../presenters/OrderPresenters";
import WebhookDTO from "../core/webhooks/dto/WebhookDTO";
import { OrderDataSource } from "../interfaces/DataSources";

export default class WebhookController {
    public static async process(orderDataSource: OrderDataSource, webhookDTO: WebhookDTO): Promise<string> {
      
      const useCase = WebhooksFactory.process(orderDataSource);            
      const updatedOrder = await useCase.updateOrderPaymentStatus(webhookDTO);

      return OrderPresenter.adaptOrderData(updatedOrder);
    }
}   
