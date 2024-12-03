import { WebhooksFactory } from "../factories/WebhooksFactory";
import PaymentDTO from "../core/orders/dto/PaymentDTO";
import { OrderDataSource } from "../interfaces/DataSources";
import OrderPresenter, { OrderResponse } from "../presenters/OrderPresenters";
import { PaymentSystem } from "../interfaces/PaymentSystem";

export default class WebhookController {
  public static async processPayment(orderDataSource: OrderDataSource, paymentSystem: PaymentSystem, paymentDTO: PaymentDTO): Promise<OrderResponse> {
    const useCase = WebhooksFactory.processPayment(orderDataSource, paymentSystem);
    const updatedOrder = await useCase.updateOrderPaymentStatus(paymentDTO);

    return OrderPresenter.adaptOrderData(updatedOrder);
  }
}
