const Product = require("../../../core/entities/Product");
const ProductCategory = require("../../../core/entities/ProductCategory");

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
      ).to.throw("Missing mandatory property name");
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
      ).to.throw("Invalid Category");
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
    })
  });
});
