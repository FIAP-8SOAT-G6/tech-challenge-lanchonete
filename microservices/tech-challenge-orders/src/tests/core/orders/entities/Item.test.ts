import Item from "../../../../core/orders/entities/Item";
import MissingPropertyError from "../../../../core/common/exceptions/MissingPropertyError";

import { expect } from "chai";

describe("Item", () => {
  it("should create an item", () => {
    expect(
      () =>
        new Item({
          id: 123,
          orderId: 1,
          productId: 1,
          quantity: 1,
          unitPrice: 12.99,
          productName: "Hamburguer",
          productDescription: "Classic Hamburguer"
        })
    ).to.not.throw();
  });

  it("should throw an error when quantity is not provided", () => {
    expect(
      () =>
        new Item({
          id: 123,
          orderId: 1,
          productId: 1,
          quantity: 0,
          unitPrice: 12.99,
          productName: "Hamburguer",
          productDescription: "Classic Hamburguer"
        })
    ).to.throw(new MissingPropertyError("quantity").message);
  });

  it("should get attributes", () => {
    const item = new Item({
      id: 123,
      orderId: 1,
      productId: 1,
      quantity: 1,
      unitPrice: 12.99,
      productName: "Hamburguer",
      productDescription: "Classic Hamburguer"
    });

    expect(item.getAttributes()).to.be.deep.equals(item);
  });
});
