import Item from "./Item";
import { OrderStatus, isValidOrderStatus } from "./OrderStatus";

import EmptyOrderError from "../exceptions/EmptyOrderError";
import InvalidStatusTransitionError from "../exceptions/InvalidStatusTransitionError";
import ClosedOrderError from "../exceptions/ClosedOrderError";
import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import ItemDTO from "../dto/ItemDTO";
import OrderPaymentsStatus, { isValidOrderPaymentStatus } from "./OrderPaymentsStatus";
import ForbiddenPaymentStatusChangeError from "../exceptions/ForbiddenPaymentStatusChangeError";

const ALLOWED_TARGET_STATUS_TRANSITIONS: {
  [key in OrderStatus]: OrderStatus[];
} = {
  [OrderStatus.CREATED]: [],
  [OrderStatus.PENDING_PAYMENT]: [OrderStatus.CREATED],
  [OrderStatus.PAYED]: [OrderStatus.PENDING_PAYMENT],
  [OrderStatus.RECEIVED]: [OrderStatus.PAYED],
  [OrderStatus.PREPARING]: [OrderStatus.RECEIVED],
  [OrderStatus.DONE]: [OrderStatus.PREPARING],
  [OrderStatus.FINISHED]: [OrderStatus.DONE]
};

const statusTransitionValidator = {
  [OrderStatus.CREATED]: function (order: Order) {},
  [OrderStatus.PENDING_PAYMENT]: function (order: Order) {
    if (order.getItems().length === 0) {
      throw new EmptyOrderError();
    }
  },
  [OrderStatus.PAYED]: function (order: Order) {
    if (order.getPaymentStatus() !== OrderPaymentsStatus.APPROVED) {
      throw new ForbiddenPaymentStatusChangeError();
    }
  },
  [OrderStatus.RECEIVED]: function (order: Order) {},
  [OrderStatus.PREPARING]: function (order: Order) {},
  [OrderStatus.DONE]: function (order: Order) {},
  [OrderStatus.FINISHED]: function (order: Order) {}
};

type OrderParams = {
  id?: number;
  createdAt?: Date;
  code: string;
  status: string;
  totalPrice?: number;
  items?: ItemDTO[];
  customerId: number;
  paymentStatus?: string;
};

export default class Order {
  private id!: number | undefined;
  private createdAt!: Date | undefined;
  private code!: string;
  private status!: OrderStatus;
  private totalPrice!: number;
  private items!: Item[];
  private customerId!: number;
  private paymentStatus!: OrderPaymentsStatus;

  constructor({ id, createdAt, code, status, customerId, items = [], paymentStatus = OrderPaymentsStatus.PENDING }: OrderParams) {
    this.id = id;
    this.createdAt = createdAt;
    this.code = code;
    this.totalPrice = 0;
    this.items = [];
    this.customerId = customerId;
    this.paymentStatus = paymentStatus as OrderPaymentsStatus;
    this.setItems(items);
    this.setStatus(status);
  }

  getId() {
    return this.id;
  }

  getCode() {
    return this.code;
  }

  getStatus() {
    return this.status;
  }

  getTotalPrice() {
    return this.totalPrice;
  }

  getCustomerId() {
    return this.customerId;
  }

  getItems() {
    return this.items;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getPaymentStatus() {
    return this.paymentStatus;
  }

  setStatus(status: string) {
    if (isValidOrderStatus(status)) {
      const requiredStatusForTarget = ALLOWED_TARGET_STATUS_TRANSITIONS[status];
      if (!this.status || requiredStatusForTarget.includes(this.status)) {
        const transitionValidator = statusTransitionValidator[status];
        transitionValidator(this);
        this.status = status;
      } else {
        throw new InvalidStatusTransitionError(this.status as string, status, ALLOWED_TARGET_STATUS_TRANSITIONS[status]);
      }
    }
  }

  setPaymentStatus(paymentStatus: string) {
    if (isValidOrderPaymentStatus(paymentStatus)) {
      this.paymentStatus = paymentStatus as OrderPaymentsStatus;
    }
  }

  addItem({
    id,
    productId,
    quantity,
    unitPrice,
    totalPrice,
    productName,
    productDescription
  }: {
    id?: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    totalPrice?: number;
    productName?: string;
    productDescription?: string;
  }) {
    if (this.getStatus() !== OrderStatus.CREATED) throw new ClosedOrderError(this.getId(), this.getStatus());

    const item = new Item({
      id,
      productId,
      orderId: this.id!,
      quantity,
      unitPrice,
      productName,
      productDescription
    });
    this.items.push(item);
    this.#calculateTotalPrice();

    return item;
  }

  getElapsedTime() {
    if (!this.createdAt) return 0;
    return Date.now() - this.createdAt.getTime();
  }

  updateItem(itemId: number, updatedValues: { quantity: number }) {
    if (this.getStatus() !== OrderStatus.CREATED) throw new ClosedOrderError(this.getId(), this.getStatus());

    const item = this.items.find((item) => item.getId() === itemId);

    if (!item) throw new ResourceNotFoundError(ResourceNotFoundError.Resources.Item, "id", itemId);

    const { quantity } = updatedValues;
    item.setQuantity(quantity);

    this.#calculateTotalPrice();
    return item;
  }

  removeItem(itemId: number) {
    if (this.getStatus() !== OrderStatus.CREATED) throw new ClosedOrderError(this.getId(), this.getStatus());

    const itemIndex = this.items.findIndex((item) => item.getId() === itemId);
    if (itemIndex < 0) throw new ResourceNotFoundError(ResourceNotFoundError.Resources.Item, "id", itemId);

    this.items.splice(itemIndex, 1);
  }

  setItems(items: ItemDTO[]) {
    items.forEach(this.#insertIntoItems.bind(this));
    this.#calculateTotalPrice();
  }

  #insertIntoItems(itemDTO: ItemDTO) {
    const { id, productId, quantity, unitPrice, productName, productDescription } = itemDTO;
    const item = new Item({
      id,
      productId: productId!,
      orderId: this.id!,
      quantity: quantity!,
      unitPrice: unitPrice!,
      productName,
      productDescription
    });
    this.items.push(item);
  }

  #calculateTotalPrice() {
    this.totalPrice = Number(this.items.reduce((currentSum, item) => currentSum + item.getTotalPrice(), 0).toFixed(2));
  }
}
