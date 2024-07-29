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
            "Describing this product..."
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
            "Describing this product..."
          )
      ).to.throw(new MissingPropertyError("category").message);
    });
    it("should throw an error when invalid category is provided", () => {
      expect(
        () =>
          new Product(
            undefined,
            "Product1",
            "INVALID CATEGORY",
            "Describing this product..."
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
            "Describing this product..."
          )
      ).to.not.throw();
    });
  });
});
