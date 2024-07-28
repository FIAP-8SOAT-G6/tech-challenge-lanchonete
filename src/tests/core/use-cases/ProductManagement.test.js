const FakeProductRepository = require("../../../adapters/database/FakeProductRepository");
const ProductCategory = require("../../../core/entities/ProductCategory");
const ProductManagement = require("../../../core/use-cases/ProductManagement");

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

context("ProductManagement", () => {
  describe("create", () => {
    it("should create a Product with an id", async () => {
      const repository = new FakeProductRepository();
      const productManagementUseCase = new ProductManagement(repository);
      const productValues = {
        name: "Hamburguer",
        category: ProductCategory.Lanche,
        description: "Big Hamburguer",
      };

      const product = await productManagementUseCase.create(productValues);

      expect(product).to.not.be.undefined;
      expect(product.id).to.be.equal(1);
    });
  });
  describe("findById", () => {
    it("should return the Product if given id", async () => {
      const repository = new FakeProductRepository();
      const productManagementUseCase = new ProductManagement(repository);
      const productValues = {
        name: "Hamburguer",
        category: ProductCategory.Lanche,
        description: "Big Hamburguer",
      };
      const product = await productManagementUseCase.create(productValues);

      const foundProduct = await productManagementUseCase.findById(product.id);

      expect(foundProduct).to.not.be.undefined;
    });
    it("should return undefined if no Product exists for ID", async () => {
      const repository = new FakeProductRepository();
      const productManagementUseCase = new ProductManagement(repository);
      const unexistingId = 1;

      const foundProduct = await productManagementUseCase.findById(
        unexistingId
      );
      expect(foundProduct).to.be.undefined;
    });
  });
  describe("findAll", () => {
    it("should return all Products", async () => {
      const repository = new FakeProductRepository();
      const productManagementUseCase = new ProductManagement(repository);
      await Promise.all([
        productManagementUseCase.create({
          name: "Hamburguer",
          category: ProductCategory.Lanche,
          description: "Big Hamburguer",
        }),
        productManagementUseCase.create({
          name: "French Fries",
          category: ProductCategory.Acompanhamento,
          description: "250g of French Fries",
        }),
      ]);

      const products = await productManagementUseCase.findAll();

      expect(products).to.not.be.undefined;
      expect(products.length).to.be.at.least(2);
    });
  });
  describe("findByCategory", () => {
    it("should return all Products of given category", async () => {
      const repository = new FakeProductRepository();
      const productManagementUseCase = new ProductManagement(repository);
      await Promise.all([
        productManagementUseCase.create({
          name: "Hamburguer",
          category: ProductCategory.Lanche,
          description: "Big Hamburguer",
        }),
        productManagementUseCase.create({
          name: "Hot-Dog",
          category: ProductCategory.Lanche,
          description: "Classic New York Hot Dog",
        }),
        productManagementUseCase.create({
          name: "French Fries",
          category: ProductCategory.Acompanhamento,
          description: "250g of French Fries",
        }),
      ]);

      const products = await productManagementUseCase.findByCategory(
        ProductCategory.Lanche
      );

      expect(products).to.not.be.undefined;
      expect(products.length).to.be.equals(2);
      products.forEach((product) =>
        expect(product.category).to.be.equal(ProductCategory.Lanche)
      );
    });

    it("should reject if invalid category is passed", async () => {
      const repository = new FakeProductRepository();
      const productManagementUseCase = new ProductManagement(repository);
      const invalidCategory = "UNEXISTING_CATEGORY";

      await expect(
        productManagementUseCase.findByCategory(invalidCategory)
      ).to.be.eventually.rejectedWith("Invalid Category");
    });
  });
  describe("update", () => {
    it("should update only product fields", async () => {
      const repository = new FakeProductRepository();
      const productManagementUseCase = new ProductManagement(repository);
      const productValues = {
        name: "Hamburguer",
        category: ProductCategory.Lanche,
        description: "Big Hamburguer",
      };
      const product = await productManagementUseCase.create(productValues);

      await productManagementUseCase.update(product.id, {
        name: "French Fries",
        description: "This should actually be some French Fries",
        category: ProductCategory.Acompanhamento
      });

      let foundProduct = await productManagementUseCase.findById(product.id);
      expect(foundProduct).to.not.be.undefined;
      expect(foundProduct.name).to.be.equals("French Fries");
      expect(foundProduct.category).to.be.equals(ProductCategory.Acompanhamento);
      expect(foundProduct.description).to.be.equals("This should actually be some French Fries");

      await productManagementUseCase.update(product.id, {});

      foundProduct = await productManagementUseCase.findById(product.id);
      expect(foundProduct).to.not.be.undefined;
      expect(foundProduct.name).to.be.equals("French Fries");
      expect(foundProduct.category).to.be.equals(ProductCategory.Acompanhamento);
      expect(foundProduct.description).to.be.equals("This should actually be some French Fries");
    });
    it("should reject if product does not exist", async () => {
      const repository = new FakeProductRepository();
      const productManagementUseCase = new ProductManagement(repository);
      const unexistingId = -1;

      const updatePromise = productManagementUseCase.update(unexistingId, {
        description: "Very Big Hamburguer",
      });

      await expect(updatePromise).to.be.eventually.rejectedWith("Product does not exist")
    });
  });
  describe("delete", () => {
    it("should delete the Product of given id", async () => {
      const repository = new FakeProductRepository();
      const productManagementUseCase = new ProductManagement(repository);
      const productValues = {
        name: "Hamburguer",
        category: ProductCategory.Lanche,
        description: "Big Hamburguer",
      };
      const product = await productManagementUseCase.create(productValues);

      await productManagementUseCase.delete(product.id);

      const foundProduct = await productManagementUseCase.findById(product.id);
      expect(foundProduct).to.be.undefined;
    });
  });
});
