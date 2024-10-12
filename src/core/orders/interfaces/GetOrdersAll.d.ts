import OrderDTO from "../dto/CustomerDTO";

export default interface GetOrdersAll {
  getOrdersAll(): Promise<OrderDTO[] | undefined>;
}
