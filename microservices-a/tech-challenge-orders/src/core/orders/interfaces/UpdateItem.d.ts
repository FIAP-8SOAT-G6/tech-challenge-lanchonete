import OrderDTO from "../dto/OrderDTO";
import ItemDTO from "../dto/ItemDTO";

export default interface UpdateItem {
  updateItem(orderId: number, itemId: number, updateItemDTO: ItemDTO): Promise<OrderDTO>;
}
