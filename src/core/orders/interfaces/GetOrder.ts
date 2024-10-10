import OrderDTO from "../dto/OrderDTO";

export default interface GetOrder {
  getOrder(orderId: number): Promise<OrderDTO>;
}
