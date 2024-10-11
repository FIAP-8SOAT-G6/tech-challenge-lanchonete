import OrderDTO from "../dto/CustomerDTO";

export default interface GetOrders {
  getOrders(): Promise<OrderDTO[] | []>;
}
