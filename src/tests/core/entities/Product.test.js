const Product = require("../../../core/entities/Product");
const ProductCategory = require("../../../core/entities/ProductCategory");
const InvalidCategoryError = require("../../../core/exceptions/InvalidCategoryError");
const MissingPropertyError = require("../../../core/exceptions/MissingPropertyError");

const expect = require("chai").expect;

context("Product", () => {
  describe("validations", () => {
    it("should throw an error when name is not provided", () => {
      expect(
        () =>
          new Product(
            undefined,
            "",
            ProductCategory.Lanche,
            "Describing this product...",
            10
          )
      ).to.throw(new MissingPropertyError("name").message);
    });
    it("should throw an error when category is not provided", () => {
      expect(
        () =>
          new Product(
            undefined,
            "Naming this product",
            undefined,
            "Describing this product...",
            10
          )
      ).to.throw(new MissingPropertyError("category").message);
    });
    it("should throw an error when price is 0", () => {
      expect(
        () =>
          new Product(
            undefined,
            "Naming this product",
            ProductCategory.Lanche,
            "Describing this product...",
            0
          )
      ).to.throw(new MissingPropertyError("price").message);
    });
    it("should throw an error when price is negative", () => {
      expect(
        () =>
          new Product(
            undefined,
            "Naming this product",
            ProductCategory.Lanche,
            "Describing this product...",
            -10
          )
      ).to.throw(new MissingPropertyError("price").message);
    });
    it("should throw an error when invalid category is provided", () => {
      expect(
        () =>
          new Product(
            undefined,
            "Product1",
            "INVALID CATEGORY",
            "Describing this product...",
            12
          )
      ).to.throw(new InvalidCategoryError("INVALID CATEGORY").message);
    });
    it("should not throw an error when validations pass", () => {
      expect(
        () =>
          new Product(
            undefined,
            "Product1",
            ProductCategory.Lanche,
            "Describing this product...",
            12
          )
      ).to.not.throw();
    });
  });
});
