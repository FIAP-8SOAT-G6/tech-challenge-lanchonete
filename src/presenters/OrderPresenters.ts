import OrderDTO from "../core/orders/dto/OrderDTO";

export type OrderResponse = {
  id: number;
  createdAt: Date;
  code: string;
  customerId: number;
  status: string;
  paymentStatus: string;
  totalPrice: number;
  items: {
    id: number;
    orderId: number;
    productId: number;
    productName: string;
    productDescription: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
};

export type QRCodeResponse = {
  qrCode: string;
};

export default class OrderPresenter {
  public static adaptOrderCheckoutData(qrCode: string): QRCodeResponse {
    return {
      qrCode: qrCode
    };
  }

  public static adaptOrderData(order: OrderDTO | undefined): OrderResponse {
    if (!order) return {} as OrderResponse;
    return {
      id: order.id,
      createdAt: order.createdAt,
      code: order.code,
      customerId: order.customerId,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalPrice: order.totalPrice,
      items: order.items?.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        productName: item.productName,
        productDescription: item.productDescription,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      }))
    } as OrderResponse;
  }

  public static adaptOrdersData(orders: OrderDTO[] | undefined): OrderResponse[] {
    if (!orders) return [];
    return orders.map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      code: order.code,
      customerId: order.customerId,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalPrice: order.totalPrice,
      items: order.items?.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        productName: item.productName,
        productDescription: item.productDescription,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      }))
    })) as OrderResponse[];
  }
}
