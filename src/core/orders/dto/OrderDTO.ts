import ItemDTO from "./ItemDTO";

export default class OrderDTO {
  public id?: number;
  public createdAt?: Date;
  public code?: string;
  public status?: string;
  public totalPrice?: number;
  public items?: ItemDTO[];
  public customerId?: number | null;
  public elapsedTime?: number;
  public paymentStatus?: string;
  constructor({
    id,
    createdAt,
    code,
    status,
    totalPrice,
    items,
    customerId,
    elapsedTime,
    paymentStatus
  }: {
    id?: number;
    createdAt?: Date;
    code?: string;
    status?: string;
    totalPrice?: number;
    items?: ItemDTO[];
    customerId?: number | null;
    elapsedTime?: number;
    paymentStatus?: string;
  }) {
    this.id = id;
    this.createdAt = createdAt;
    this.code = code;
    this.status = status;
    this.totalPrice = Number(totalPrice) || 0;
    this.items = items;
    this.customerId = customerId;
    this.elapsedTime = elapsedTime;
    this.paymentStatus = paymentStatus;
  }
}
