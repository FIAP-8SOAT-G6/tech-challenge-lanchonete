import OrderDTO from "../dto/OrderDTO";

export default interface CheckoutOrder {
  checkout(orderId: number): Promise<OrderDTO>;
}
