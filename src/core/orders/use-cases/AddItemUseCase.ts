import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import OrderGateway from "../../interfaces/OrderGateway";
import ProductGateway from "../../interfaces/ProductGateway";
import ItemDTO from "../dto/ItemDTO";
import OrderDTO from "../dto/OrderDTO";
import AddItem from "../interfaces/AddItem";
import OrderMapper from "../mappers/OrderMappers";

export default class AddItemUseCase implements AddItem {
  constructor(
    private orderGateway: OrderGateway,
    private productGateway: ProductGateway
  ) {}

  async addItem(orderId: number, itemDTO: ItemDTO): Promise<OrderDTO> {
    const { productId, quantity } = itemDTO;

    const [productDTO, orderDTO] = await Promise.all([this.productGateway.getByProductId(productId!), this.orderGateway.getOrder(orderId)]);

    this.#validateOrderExists(orderDTO?.id!, orderId);
    if (!productDTO) throw new ResourceNotFoundError(ResourceNotFoundError.Resources.Product, "id", productId);

    const order = OrderMapper.toOrderEntity(orderDTO!);
    const item = order.addItem({
      productId: productDTO.id!,
      quantity: quantity!,
      unitPrice: productDTO.price!
    });

    await this.orderGateway.addItem(OrderMapper.toOrderDTO(order), OrderMapper.toItemDTO(item));

    const updatedOrderDTO = await this.orderGateway.getOrder(orderId);
    const updatedOrder = OrderMapper.toOrderEntity(updatedOrderDTO!);

    return OrderMapper.toOrderDTO(updatedOrder);
  }

  #validateOrderExists(orderIdFound: number, orderIdReceived: number) {
    if (!orderIdFound) throw new ResourceNotFoundError(ResourceNotFoundError.Resources.Order, "id", orderIdReceived);
  }
}
