import Product from "../../../../core/products/entities/Product";
import ProductCategory from "../../../../core/products/entities/ProductCategory";
import InvalidCategoryError from "../../../../core/products/exceptions/InvalidCategoryError";
import MissingPropertyError from "../../../../core/common/exceptions/MissingPropertyError";

import { expect } from "chai";

context("Product", () => {
  describe("validations", () => {
    it("should throw an error when name is not provided", () => {
      expect(
        () =>
          new Product({
            name: undefined as unknown as string,
            description: "Random description",
            category: ProductCategory.Lanche,
            price: 10
          })
      ).to.throw(new MissingPropertyError("name").message);
    });
    it("should throw an error when category is not provided", () => {
      expect(
        () =>
          new Product({
            name: "Naming this product",
            description: "Random description",
            category: undefined as unknown as string,
            price: 10
          })
      ).to.throw(new MissingPropertyError("category").message);
    });
    it("should throw an error when price is 0", () => {
      expect(
        () =>
          new Product({
            name: "Naming this product",
            description: "Random description",
            category: ProductCategory.Lanche,
            price: 0
          })
      ).to.throw(new MissingPropertyError("price").message);
    });
    it("should throw an error when price is negative", () => {
      expect(
        () =>
          new Product({
            name: "Naming this product",
            description: "Random description",
            category: ProductCategory.Lanche,
            price: -10
          })
      ).to.throw(new MissingPropertyError("price").message);
    });
    it("should throw an error when invalid category is provided", () => {
      expect(
        () =>
          new Product({
            name: "Product1",
            description: "Random description",
            category: "INVALID CATEGORY",
            price: 12
          })
      ).to.throw(new InvalidCategoryError("INVALID CATEGORY").message);
    });
    it("should not throw an error when validations pass", () => {
      expect(
        () =>
          new Product({
            name: "Product1",
            category: ProductCategory.Lanche,
            description: "Describing this product...",
            price: 12,
            images: [{ url: "http://url1.com" }, { url: "http://url2.com" }]
          })
      ).to.not.throw();
    });
  });
});
