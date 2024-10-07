import MissingPropertyError from "../../common/exceptions/MissingPropertyError";

export type ItemParams = {
  id?: number;
  orderId: number;
  productId: number;
  productName?: string;
  productDescription?: string;
  quantity: number;
  unitPrice: number;
};

export default class Item {
  private id!: number | undefined;
  private orderId!: number;
  private productId!: number;
  private productName!: string | undefined;
  private productDescription!: string | undefined;
  private quantity!: number;
  private unitPrice!: number;
  private totalPrice!: number;

  constructor({
    id,
    orderId,
    productId,
    productName,
    productDescription,
    quantity,
    unitPrice
  }: ItemParams) {
    this.id = id;
    this.orderId = orderId;
    this.productId = productId;

    this.productName = productName;
    this.productDescription = productDescription;
    this.unitPrice = unitPrice;

    this.setQuantity(quantity);

    this.#updateTotalPrice();
  }

  getId() {
    return this.id;
  }

  getOrderId() {
    return this.orderId;
  }

  getProductId() {
    return this.productId;
  }

  getProductName() {
    return this.productName;
  }

  getProductDescription() {
    return this.productDescription;
  }

  getQuantity() {
    return this.quantity;
  }

  getUnitPrice() {
    return this.unitPrice;
  }

  getTotalPrice() {
    return this.totalPrice;
  }

  setQuantity(quantity: number) {
    this.#validateQuantity(quantity);
    this.quantity = quantity;
    this.#updateTotalPrice();
  }

  #updateTotalPrice() {
    this.totalPrice = this.unitPrice * this.quantity;
  }

  #validateQuantity(quantity: number) {
    if (!quantity || quantity <= 0) {
      throw new MissingPropertyError("quantity");
    }
  }

  getAttributes() {
    return {
      id: this.id,
      orderId: this.orderId,
      productId: this.productId,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      totalPrice: this.totalPrice
    };
  }
}
