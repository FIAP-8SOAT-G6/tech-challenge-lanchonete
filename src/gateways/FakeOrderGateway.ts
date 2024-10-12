import OrderGateway from "../core/gateways/OrderGateway";
import ItemDTO from "../core/orders/dto/ItemDTO";
import OrderDTO from "../core/orders/dto/OrderDTO";

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

export default class FakeOrderGateway implements OrderGateway {
  private orders: FakeOrder[] = [];
  private items: FakeItem[] = [];

  async createOrder(orderDTO: OrderDTO): Promise<OrderDTO> {
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

  async getOrdersByStatusAndSortByAscDate(orderStatus: string): Promise<OrderDTO[]> {
    const orders = this.orders
      .filter((order) => order.status === orderStatus)
      .map((order) => ({
        ...order,
        items: this.items.filter((item) => item.OrderId === order.id)
      }))
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());

    return orders?.length === 0 ? [] : orders.map(this.#createOrderDTO);
  }

  async getOrder(id: number): Promise<OrderDTO | undefined> {
    const order = this.orders.find((order) => order.id === id);
    if (!order) return undefined;
    order.items = this.items.filter((item) => item.OrderId === order.id);
    return this.#createOrderDTO(order);
  }

  async getOrdersAll(): Promise<OrderDTO[] | []> {
    const orders = this.orders.map((order) => ({
      ...order,
      items: this.items.filter((item) => item.OrderId === order.id)
    }));
    return orders?.length === 0 ? [] : orders.map(this.#createOrderDTO);
  }

  async getPaymentStatus(orderId: number): Promise<string> {
    const order = this.orders.find((order) => order.id === orderId);
    return order?.status || "";
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

  async updateOrderStatus(orderId: number, status: string): Promise<OrderDTO> {
    const orderIndex = this.orders.findIndex((order) => order.id === orderId);
    this.orders[orderIndex].status = status;
    return Promise.resolve(this.#createOrderDTO(this.orders[orderIndex]));
  }

  async addItem(orderDTO: OrderDTO, itemDTO: ItemDTO): Promise<OrderDTO> {
    const { id: OrderId } = orderDTO;
    const { productId: ProductId, quantity, unitPrice, totalPrice } = itemDTO;

    this.items.push({
      id: this.items.length + 1,
      OrderId,
      ProductId,
      quantity,
      unitPrice,
      totalPrice
    });

    const order = this.orders.find((order) => order.id === OrderId);

    return this.#createOrderDTO(order);
  }

  async updateItem(itemId: number, itemDTO: ItemDTO): Promise<OrderDTO> {
    const itemIndex = this.items.findIndex((item) => item.id === itemId);
    this.items[itemIndex] = {
      ...this.items[itemIndex],
      ...itemDTO
    };
    const orderId = this.items[itemIndex].OrderId;
    const order = this.orders.find((order) => order.id === orderId);
    return Promise.resolve(this.#createOrderDTO(order));
  }

  async deleteItem(orderId: number, itemId: number) {
    const itemIndex = this.items.findIndex((item) => item.OrderId === orderId && item.id === itemId);
    this.items.splice(itemIndex, 1);
    return Promise.resolve();
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
