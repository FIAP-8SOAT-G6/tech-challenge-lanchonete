export default interface CheckoutOrder {
  checkout(orderId: number): Promise<any>;
}
