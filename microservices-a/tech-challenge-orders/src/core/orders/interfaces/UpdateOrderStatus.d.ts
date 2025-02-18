import OrderDTO from "../dto/OrderDTO";

export default interface UpdateOrderStatus {
  updateOrderStatus(orderId: number, status: string): Promise<OrderDTO>;
}
