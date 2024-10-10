export default interface OrderGateway {
  createOrder(orderDTO: OrderDTO): Promise<OrderDTO>;

  getOrder(orderId: number): Promise<OrderDTO | undefined>;
  //getOrdersByPriority(status: string): Promise<OrderDTO[] | []>;
  //getOrdersAll(): Promise<OrderDTO[] | undefined>;
  //getPaymentStatus(orderId: number): Promise<string>;
  // updateOrderStatus(orderId: number, status: string): Promise<OrderDTO>;

  // checkout(orderId: number): Promise<any>;

  // addItem(orderId: number, ItemDTO: ItemDTO): Promise<OrderDTO>;
  // updateItem(orderId: number, itemId: number, updateItemDTO: ItemDTO): Promise<OrderDTO>;
  // deleteItem(orderId: number, itemId: number): Promise<undefined>;
}
