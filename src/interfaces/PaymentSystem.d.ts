export interface OrderPaymentPayload {
    externalReference: string;
    title: string;
    totalAmount: number;
}

export interface PaymentStatus {
    paymentStatus: boolean
}

type QRCodeString = string;

export interface PaymentSystem {
    async sendPaymentRequest(payload: OrderPaymentPayload): Promise<QRCodeString>;
    async getPaymentDetails(paymentID): Promise<PaymentStatus>;
}