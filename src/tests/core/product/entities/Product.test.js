const Product = require("../../../../core/products/entities/Product");
const ProductCategory = require("../../../../core/products/entities/ProductCategory");
const InvalidCategoryError = require("../../../../core/products/exceptions/InvalidCategoryError");
const MissingPropertyError = require("../../../../core/common/exceptions/MissingPropertyError");

const expect = require("chai").expect;

context("Product", () => {
  describe("validations", () => {
    it("should throw an error when name is not provided", () => {
      expect(
        () =>
          new Product({
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
            price: 10
          })
      ).to.throw(new MissingPropertyError("category").message);
    });
    it("should throw an error when price is 0", () => {
      expect(
        () =>
          new Product({
            name: "Naming this product",
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
            images: ["http://url1.com", "http://url2.com"]
          })
      ).to.not.throw();
    });
  });
});
