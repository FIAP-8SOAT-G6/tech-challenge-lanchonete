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
  public paymentStatus?: string;
  constructor({
    id,
    createdAt,
    code,
    status,
    totalPrice,
    items,
    customerId,
    customerName,
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
    customerName?: string;
    elapsedTime?: number;
    paymentStatus?: string;
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
    this.paymentStatus = paymentStatus;
  }
}
