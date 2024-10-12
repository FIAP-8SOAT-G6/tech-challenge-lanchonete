import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import OrderGateway from "../../gateways/OrderGateway";
import ProductGateway from "../../gateways/ProductGateway";
import ItemDTO from "../dto/ItemDTO";
import OrderDTO from "../dto/OrderDTO";
import Item from "../entities/Item";
import Order from "../entities/Order";
import AddItem from "../interfaces/AddItem";

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

    const order = this.#toOrderEntity(orderDTO!);
    const item = order.addItem({
      productId: productDTO.id!,
      quantity: quantity!,
      unitPrice: productDTO.price!
    });

    await this.orderGateway.addItem(this.#toOrderDTO(order), this.#toItemDTO(item));

    const updatedOrderDTO = await this.orderGateway.getOrder(orderId);
    const updatedOrder = this.#toOrderEntity(updatedOrderDTO!);

    return this.#toOrderDTO(updatedOrder);
  }

  #validateOrderExists(orderIdFound: number, orderIdReceived: number) {
    if (!orderIdFound) throw new ResourceNotFoundError(ResourceNotFoundError.Resources.Order, "id", orderIdReceived);
  }

  #toOrderEntity(orderDTO: OrderDTO) {
    return new Order({
      id: orderDTO.id,
      createdAt: orderDTO.createdAt,
      code: orderDTO.code!,
      customerId: orderDTO.customerId!,
      status: orderDTO.status!,
      paymentStatus: orderDTO.paymentStatus!,
      totalPrice: orderDTO.totalPrice,
      items: orderDTO.items
    });
  }

  #toOrderDTO(orderEntity: Order) {
    return new OrderDTO({
      id: orderEntity.getId(),
      createdAt: orderEntity.getCreatedAt(),
      code: orderEntity.getCode(),
      totalPrice: orderEntity.getTotalPrice(),
      items: orderEntity.getItems().map(this.#toItemDTO),
      customerId: orderEntity.getCustomerId(),
      status: orderEntity.getStatus(),
      paymentStatus: orderEntity.getPaymentStatus(),
      elapsedTime: orderEntity.getElapsedTime()
    });
  }

  #toItemDTO(itemEntity: Item) {
    return new ItemDTO({
      id: itemEntity.getId(),
      orderId: itemEntity.getOrderId(),
      productId: itemEntity.getProductId(),
      productName: itemEntity.getProductName(),
      productDescription: itemEntity.getProductDescription(),
      quantity: itemEntity.getQuantity(),
      unitPrice: itemEntity.getUnitPrice(),
      totalPrice: itemEntity.getTotalPrice()
    });
  }
}
