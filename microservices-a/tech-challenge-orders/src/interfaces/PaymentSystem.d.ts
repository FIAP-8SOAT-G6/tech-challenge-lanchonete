export interface OrderPaymentPayload {
    externalReference: string;
    title: string;
    totalAmount: number;
}

export interface PaymentDetails {
    id: number;
    paymentStatus: string;
    externalReference: string;
    approvalDate: string;
}

type QRCodeString = string;

export interface PaymentSystem {
    async sendPaymentRequest(payload: OrderPaymentPayload): Promise<QRCodeString>;
    async getPaymentDetails(paymentID): Promise<PaymentDetails | undefined>;
}