import { WebhooksFactory } from "../factories/WebhooksFactory";
import PaymentDTO from "../core/orders/dto/PaymentDTO";
import { OrderDataSource } from "../interfaces/DataSources";
import OrderPresenter, { OrderResponse } from "../presenters/OrderPresenters";

export default class WebhookController {
  public static async process(orderDataSource: OrderDataSource, paymentDTO: PaymentDTO): Promise<OrderResponse> {
    const useCase = WebhooksFactory.process(orderDataSource);
    const updatedOrder = await useCase.updateOrderPaymentStatus(paymentDTO);

    return OrderPresenter.adaptOrderData(updatedOrder);
  }
}
