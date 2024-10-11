import OrderDTO from "../core/orders/dto/OrderDTO";

export default class OrderPresenter {
  public static adaptOrderData(order: OrderDTO | undefined): string {
    if (!order) return JSON.stringify({});
    return JSON.stringify({
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
    });
  }

  public static adaptOrdersData(orders: OrderDTO[] | null): string {
    if (!orders) return JSON.stringify({});
    return JSON.stringify(
      orders.map((order) => ({
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
      }))
    );
  }
}
