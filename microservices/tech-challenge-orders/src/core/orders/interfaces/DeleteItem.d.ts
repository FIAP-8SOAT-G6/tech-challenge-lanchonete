export default interface DeleteItem {
  deleteItem(orderId: number, itemId: number): Promise<undefined>;
}
