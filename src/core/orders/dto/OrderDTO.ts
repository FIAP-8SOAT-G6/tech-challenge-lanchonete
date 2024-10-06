import ItemDTO from "./ItemDTO";

export default class OrderDTO {
  public id?: number;
  public createdAt?: Date;
  public code?: string;
  public status?: string;
  public totalPrice?: number;
  public items?: ItemDTO[];
  public customerId?: number | null;
  public customerName?: string;
  public elapsedTime?: number;
  constructor({
    id,
    createdAt,
    code,
    status,
    totalPrice,
    items,
    customerId,
    customerName,
    elapsedTime
  }: {
    id?: number;
    createdAt?: Date;
    code?: string;
    status?: string;
    totalPrice?: number;
    items?: ItemDTO[];
    customerId?: number | null;
    customerName?: string;
    elapsedTime?: number;
  }) {
    this.id = id;
    this.createdAt = createdAt;
    this.code = code;
    this.status = status;
    this.totalPrice = Number(totalPrice);
    this.items = items;
    this.customerId = customerId;
    this.customerName = customerName;
    this.elapsedTime = elapsedTime;
  }
}

module.exports = OrderDTO;
