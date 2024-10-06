import ItemDTO from "../../core/orders/dto/ItemDTO";
import OrderDTO from "../../core/orders/dto/OrderDTO";
import OrderRepository from "../../core/ports/OrderRepository";

type FakeOrder = {
  id: number;
  status?: string;
  code?: string;
  items: FakeItem[];
  createdAt?: Date;
  customerId?: number | null;
};

type FakeItem = {
  id?: number;
  OrderId?: number;
  ProductId?: number;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  productName?: string;
  productDescription?: string;
};

export default class FakeOrderRepository implements OrderRepository {
  private orders: FakeOrder[] = [];
  private items: FakeItem[] = [];

  async create(orderDTO: OrderDTO): Promise<OrderDTO> {
    const { status, code, customerId } = orderDTO;
    const order = {
      id: this.orders.length + 1,
      status,
      code,
      items: [],
      createdAt: new Date(),
      customerId
    };
    this.orders.push(order);
    return this.#createOrderDTO(order);
  }

  async findById(id: number): Promise<OrderDTO | undefined> {
    const order = this.orders.find((order) => order.id === id);
    if (!order) return undefined;
    order.items = this.items.filter((item) => item.OrderId === order.id);
    return this.#createOrderDTO(order);
  }

  async findAll(): Promise<OrderDTO[] | undefined> {
    const orders = this.orders.map((order) => ({
      ...order,
      items: this.items.filter((item) => item.OrderId === order.id)
    }));
    return orders?.length === 0 ? undefined : orders.map(this.#createOrderDTO);
  }

  async createItem(order: OrderDTO, itemDTO: ItemDTO) {
    const { id: OrderId } = order;
    const { productId: ProductId, quantity, unitPrice, totalPrice } = itemDTO;

    this.items.push({
      id: this.items.length + 1,
      OrderId,
      ProductId,
      quantity,
      unitPrice,
      totalPrice
    });
  }

  async removeItem(orderId: number, itemId: number) {
    const itemIndex = this.items.findIndex(
      (item) => item.OrderId === orderId && item.id === itemId
    );
    this.items.splice(itemIndex, 1);
  }

  async updateItem(itemId: number, itemDTO: ItemDTO) {
    const itemIndex = this.items.findIndex((item) => item.id === itemId);
    this.items[itemIndex] = {
      ...this.items[itemIndex],
      ...itemDTO
    };
  }

  async updateOrder(orderDTO: OrderDTO): Promise<OrderDTO> {
    const { id } = orderDTO;
    const orderIndex = this.orders.findIndex((order) => order.id === id);
    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      ...orderDTO
    };
    return Promise.resolve(this.#createOrderDTO(this.orders[orderIndex]));
  }

  #createOrderDTO(databaseOrder?: FakeOrder) {
    return new OrderDTO({
      id: databaseOrder!.id,
      code: databaseOrder!.code,
      createdAt: databaseOrder!.createdAt,
      status: databaseOrder!.status,
      customerId: databaseOrder!.customerId,
      items: databaseOrder!.items.map(
        (databaseItem) =>
          new ItemDTO({
            id: databaseItem.id,
            orderId: databaseItem.OrderId!,
            productId: databaseItem.ProductId!,
            productName: databaseItem.productName,
            productDescription: databaseItem.productDescription,
            quantity: databaseItem.quantity!,
            unitPrice: databaseItem.unitPrice!,
            totalPrice: databaseItem.totalPrice!
          })
      )
    });
  }
}

