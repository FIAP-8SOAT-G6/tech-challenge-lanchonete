import OrderDTO from "../dto/OrderDTO";

export default interface CreateOrder {
  createOrder(orderDTO: OrderDTO): Promise<OrderDTO>;
}
