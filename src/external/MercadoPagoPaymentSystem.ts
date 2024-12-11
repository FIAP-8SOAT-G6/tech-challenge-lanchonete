import axios from "axios";
import { WEBHOOK_PATH } from "../api/WebhooksAPI";
import { OrderPaymentPayload, PaymentDetails, PaymentSystem } from "../interfaces/PaymentSystem";
import OrderPaymentsStatus from "../core/orders/entities/OrderPaymentsStatus";

const MERCADO_PAGO_QR_CODE_URL = "https://api.mercadopago.com/instore/orders/qr/seller/collectors/{USER_ID}/pos/{EXTERNAL_POS_ID}/qrs";
const MERCADO_PAGO_PAYMENT_URL = "https://api.mercadopago.com/v1/payments/";

const PLACEHOLDERS = {
  UserID: "{USER_ID}",
  PointOfSaleID: "{EXTERNAL_POS_ID}"
};

const MINUTES_EXPIRATION_TIME = 10;

const mercadoPagoPaymentStatusToOrderPaymentStatus: { [key: string]: OrderPaymentsStatus } = {
  pending: OrderPaymentsStatus.PENDING,
  approved: OrderPaymentsStatus.APPROVED,
  authorized: OrderPaymentsStatus.PENDING,
  in_process: OrderPaymentsStatus.PENDING,
  in_mediation: OrderPaymentsStatus.PENDING,
  rejected: OrderPaymentsStatus.DENIED,
  cancelled: OrderPaymentsStatus.DENIED
};

interface MercadoPagoQRCodePayload {
  external_reference: string;
  title: string;
  notification_url: string;
  expiration_date: string;
  total_amount: number;
  items: {
    title: string;
    unit_price: number;
    quantity: number;
    unit_measure: string;
    total_amount: number;
  }[];
}

interface MercadoPagoQRCodeResponse {
  qr_data: string;
  in_store_order_id: string;
}

export class MercadoPagoPaymentSystem implements PaymentSystem {
  async sendPaymentRequest(payload: OrderPaymentPayload): Promise<string> {
    const serviceUrl = this.getMercadoPagoQRCodeUrl();
    const servicePayload = this.buildMercadoPagoPayload(payload);

    const response = await axios.post<MercadoPagoQRCodeResponse, any, MercadoPagoQRCodePayload>(serviceUrl, servicePayload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAccessToken()}`
      }
    });

    const qrCode = response.data.qr_data;

    return qrCode;
  }

  private buildMercadoPagoPayload(payload: OrderPaymentPayload) {
    return {
      external_reference: payload.externalReference,
      title: payload.title,
      description: `Tech Challenge Lanchonete - Pedido ${payload.title}`,
      total_amount: payload.totalAmount,
      expiration_date: this.getExpirationDate(),
      notification_url: this.getNotificationUrl(),
      items: [
        {
          title: payload.title,
          unit_price: payload.totalAmount,
          quantity: 1,
          unit_measure: "unit",
          total_amount: payload.totalAmount
        }
      ]
    };
  }

  async getPaymentDetails(paymentID: any): Promise<PaymentDetails> {
    const serviceUrl = `${MERCADO_PAGO_PAYMENT_URL}/${paymentID}`;
    const response = await axios.get(serviceUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAccessToken()}`
      }
    });

    return {
      externalReference: response.data.external_reference,
      paymentStatus: this.convertToInternalPaymentStatus(response.data.status),
      approvalDate: response.data.date_approved
    };
  }

  private convertToInternalPaymentStatus(status: string): OrderPaymentsStatus {
    return mercadoPagoPaymentStatusToOrderPaymentStatus[status];
  }

  private getMercadoPagoQRCodeUrl(): string {
    const userId = process.env.MERCADO_PAGO_USER_ID!;
    const posId = process.env.MERCADO_PAGO_POINT_OF_SALE_ID!;

    return MERCADO_PAGO_QR_CODE_URL.replace(PLACEHOLDERS.UserID, userId).replace(PLACEHOLDERS.PointOfSaleID, posId);
  }

  private getNotificationUrl(): string {
    return `${process.env.NOTIFICATION_URL_HOST!}${WEBHOOK_PATH}`;
  }

  private getAccessToken(): string {
    return process.env.MERCADO_PAGO_ACCESS_TOKEN!;
  }

  private getExpirationDate(): string {
    return new Date(Date.now() + MINUTES_EXPIRATION_TIME * 60000).toISOString();
  }
}
