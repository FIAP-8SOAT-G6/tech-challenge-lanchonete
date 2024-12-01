import OrderGatewayInterface from "../core/interfaces/OrderGateway";
import PaymentGatewayInterface from "../core/interfaces/PaymentGateway";
import Order from "../core/orders/entities/Order";
import { PaymentSystem } from "../interfaces/PaymentSystem";

export class PaymentGateway implements PaymentGatewayInterface {
  constructor(
    private orderGateway: OrderGatewayInterface,
    private paymentSystem: PaymentSystem
  ) {}

  async performPayment(orderId: number): Promise<string> {
    const orderDTO = await this.orderGateway.getOrder(orderId);
    const order = new Order({
      id: orderDTO!.id,
      createdAt: orderDTO!.createdAt,
      code: orderDTO!.code!,
      customerId: orderDTO!.customerId!,
      status: orderDTO!.status!,
      paymentStatus: orderDTO!.paymentStatus!,
      totalPrice: orderDTO!.totalPrice,
      items: orderDTO!.items
    });

    const totalAmount = order.getTotalPrice();
    const externalReference = order.getId()!.toString();
    const orderTitle = `Pedido ${order.getCode()}`;

    const qrCode = await this.paymentSystem.sendPaymentRequest({
      externalReference,
      totalAmount,
      title: orderTitle
    });

    return qrCode;
  }
}
