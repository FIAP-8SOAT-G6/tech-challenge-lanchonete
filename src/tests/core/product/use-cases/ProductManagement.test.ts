import FakeProductRepository from "../../../../adapters/database/FakeProductRepository";
import ProductCategory from "../../../../core/products/entities/ProductCategory";
import InvalidCategoryError from "../../../../core/products/exceptions/InvalidCategoryError";
import ProductManagement from "../../../../core/products/use-cases/ProductManagement";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import ProductDTO from "../../../../core/products/dto/ProductDTO";
import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";

chai.use(chaiAsPromised);
const expect = chai.expect;

context("ProductManagement", () => {
  function setupUseCase() {
    const repository = new FakeProductRepository();
    return new ProductManagement(repository);
  }

  describe("create", () => {
    it("should create a Product with an id", async () => {
      const productManagementUseCase = setupUseCase();
      const productDTO = new ProductDTO({
        name: "Hamburguer",
        category: ProductCategory.Lanche,
        description: "Big Hamburguer",
        price: 12.0,
        images: [{ url: "image1" }, { url: "image2" }]
      });

      const product = await productManagementUseCase.create(productDTO);

      expect(product).to.not.be.undefined;
      expect(product.id!).to.be.equal(1);
    });
  });

  describe("findById", () => {
    it("should return the Product if given id", async () => {
      const productManagementUseCase = setupUseCase();
      const productDTO = new ProductDTO({
        name: "Hamburguer",
        category: ProductCategory.Lanche,
        description: "Big Hamburguer",
        price: 12.0,
        images: [ { url: "image1" } , { url: "image2" }]
      });

      const product = await productManagementUseCase.create(productDTO);
      const foundProduct = await productManagementUseCase.findById(product.id!);

      expect(foundProduct).to.not.be.undefined;
      expect(product.images!.length).to.be.equal(2);
    });

    it("should return error if no Product exists for ID", async () => {
      const productManagementUseCase = setupUseCase();
      const unexistingId = 15;

      await expect(
        productManagementUseCase.findById(unexistingId)
      ).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });
  });

  describe("findAll", () => {
    it("should return all Products", async () => {
      const productManagementUseCase = setupUseCase();
      await Promise.all([
        productManagementUseCase.create(
          new ProductDTO({
            name: "Hamburguer",
            category: ProductCategory.Lanche,
            description: "Big Hamburguer",
            price: 10.0,
            images: [{ url: "image1" }]
          })
        ),
        productManagementUseCase.create(
          new ProductDTO({
            name: "French Fries",
            category: ProductCategory.Acompanhamento,
            description: "250g of French Fries",
            price: 6.0,
            images: []
          })
        )
      ]);

      const products = await productManagementUseCase.findAll();

      expect(products).to.not.be.undefined;
      expect(products.length).to.be.at.least(2);
    });

    it("should return all Products with images", async () => {
      const productManagementUseCase = setupUseCase();
      await Promise.all([
        productManagementUseCase.create(
          new ProductDTO({
            name: "Hamburguer",
            category: ProductCategory.Lanche,
            description: "Big Hamburguer",
            price: 10.0,
            images: [{ url: "image1" }]
          })
        ),
        productManagementUseCase.create(
          new ProductDTO({
            name: "French Fries",
            category: ProductCategory.Acompanhamento,
            description: "250g of French Fries",
            price: 6.0,
            images: [{ url: "image1" }, { url: "image2" }]
          })
        )
      ]);

      const products = await productManagementUseCase.findAll();

      expect(products[0].images!.length).to.be.equals(1);
      expect(products[1].images!.length).to.be.equals(2);
    });
  });

  describe("findByCategory", () => {
    it("should return all Products of given category", async () => {
      const productManagementUseCase = setupUseCase();
      await Promise.all([
        productManagementUseCase.create(
          new ProductDTO({
            name: "Hamburguer",
            category: ProductCategory.Lanche,
            description: "Big Hamburguer",
            price: 10.0
          })
        ),
        productManagementUseCase.create(
          new ProductDTO({
            name: "Hot-Dog",
            category: ProductCategory.Lanche,
            description: "Classic New York Hot Dog",
            price: 10.0
          })
        ),
        productManagementUseCase.create(
          new ProductDTO({
            name: "French Fries",
            category: ProductCategory.Acompanhamento,
            description: "250g of French Fries",
            price: 10.0
          })
        )
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

    it("should return all Products of given category with images", async () => {
      const productManagementUseCase = setupUseCase();
      await Promise.all([
        productManagementUseCase.create(
          new ProductDTO({
            name: "Hamburguer",
            category: ProductCategory.Lanche,
            description: "Big Hamburguer",
            price: 10.0,
            images: [{ url: "image1" }, { url: "image2" }]
          })
        ),
        productManagementUseCase.create(
          new ProductDTO({
            name: "Hot-Dog",
            category: ProductCategory.Lanche,
            description: "Classic New York Hot Dog",
            price: 10.0,
            images: [{ url: "image1" }, { url: "image2" }, { url: "image3" }]
          })
        )
      ]);

      const products = await productManagementUseCase.findByCategory(
        ProductCategory.Lanche
      );

      expect(products[0].images!.length).to.be.equals(2);
      expect(products[1].images!.length).to.be.equals(3);
    });

    it("should reject if invalid category is passed", async () => {
      const productManagementUseCase = setupUseCase();
      const invalidCategory = "UNEXISTING_CATEGORY";

      await expect(
        productManagementUseCase.findByCategory(invalidCategory)
      ).to.be.eventually.rejectedWith(
        new InvalidCategoryError(invalidCategory).message
      );
    });
  });

  describe("update", () => {
    it("should update only product fields", async () => {
      const productManagementUseCase = setupUseCase();
      const productDTO = new ProductDTO({
        name: "Hamburguer",
        category: ProductCategory.Lanche,
        description: "Big Hamburguer",
        price: 10.0
      });
      const createdProductDTO = await productManagementUseCase.create(
        productDTO
      );

      const updateProductDTO = new ProductDTO({
        id: createdProductDTO.id!,
        name: "French Fries",
        description: "This should actually be some French Fries",
        category: ProductCategory.Acompanhamento,
        price: 12.0
      });

      await productManagementUseCase.update(updateProductDTO);

      const foundProductDTO = await productManagementUseCase.findById(
        updateProductDTO.id!
      );
      expect(foundProductDTO).to.not.be.undefined;
      expect(foundProductDTO.name).to.be.equals("French Fries");
      expect(foundProductDTO.category).to.be.equals(
        ProductCategory.Acompanhamento
      );
      expect(foundProductDTO.description).to.be.equals(
        "This should actually be some French Fries"
      );
      expect(foundProductDTO.price).to.be.equals(12.0);
    });

    it("should delete actual images and add new images in product when updated", async () => {
      const productManagementUseCase = setupUseCase();
      const productDTO = new ProductDTO({
        name: "Hamburguer",
        category: ProductCategory.Lanche,
        description: "Big Hamburguer",
        price: 10.0,
        images: [{ url: "image1" }, { url: "image2" }]
      });
      const createdProductDTO = await productManagementUseCase.create(
        productDTO
      );

      const updateProductDTO = new ProductDTO({
        id: createdProductDTO.id!,
        name: "French Fries",
        description: "This should actually be some French Fries",
        category: ProductCategory.Acompanhamento,
        price: 12.0,
        images: [{ url: "image3" }]
      });

      await productManagementUseCase.update(updateProductDTO);

      const foundProductDTO = await productManagementUseCase.findById(
        updateProductDTO.id!
      );
      expect(foundProductDTO).to.not.be.undefined;
      expect(foundProductDTO.name).to.be.equals("French Fries");
      expect(foundProductDTO.category).to.be.equals(
        ProductCategory.Acompanhamento
      );
      expect(foundProductDTO.description).to.be.equals(
        "This should actually be some French Fries"
      );
      expect(foundProductDTO.price).to.be.equals(12.0);
      expect(foundProductDTO.images!.length).to.be.equals(1);
    });

    it("should remove images when the updated product has no images", async () => {
      const productManagementUseCase = setupUseCase();
      const productDTO = new ProductDTO({
        name: "Hamburguer",
        category: ProductCategory.Lanche,
        description: "Big Hamburguer",
        price: 10.0,
        images: [{ url: "image1" }, { url: "image2" }]
      });
      const createdProductDTO = await productManagementUseCase.create(
        productDTO
      );

      const updateProductDTO = new ProductDTO({
        id: createdProductDTO.id!,
        name: "French Fries",
        description: "This should actually be some French Fries",
        category: ProductCategory.Acompanhamento,
        price: 12.0
      });

      await productManagementUseCase.update(updateProductDTO);

      const foundProductDTO = await productManagementUseCase.findById(
        updateProductDTO.id!
      );
      expect(foundProductDTO).to.not.be.undefined;
      expect(foundProductDTO.name).to.be.equals("French Fries");
      expect(foundProductDTO.category).to.be.equals(
        ProductCategory.Acompanhamento
      );
      expect(foundProductDTO.description).to.be.equals(
        "This should actually be some French Fries"
      );
      expect(foundProductDTO.price).to.be.equals(12.0);
      expect(foundProductDTO.images).to.be.deep.equals([]);
    });

    it("should reject if product does not exist", async () => {
      const productManagementUseCase = setupUseCase();
      const unexistingProductDTO = new ProductDTO({
        id: -1,
        description: "Very Big Hamburguer"
      });

      const updatePromise =
        productManagementUseCase.update(unexistingProductDTO);

      await expect(updatePromise).to.be.eventually.rejectedWith(
        ResourceNotFoundError
      );
    });
  });

  describe("delete", () => {
    it("should delete the Product of given id", async () => {
      const productManagementUseCase = setupUseCase();
      const productDTO = {
        name: "Hamburguer",
        category: ProductCategory.Lanche,
        description: "Big Hamburguer",
        price: 10.0
      };
      const createdProductDTO = await productManagementUseCase.create(
        productDTO
      );

      await productManagementUseCase.delete(createdProductDTO.id!);

      await expect(
        productManagementUseCase.findById(createdProductDTO.id!)
      ).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });

    it("should throw error  when Product does not exist", async () => {
      const productManagementUseCase = setupUseCase();
      const idNonexisting = 12;
      await productManagementUseCase.delete(idNonexisting);

      await expect(
        productManagementUseCase.findById(idNonexisting)
      ).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });
  });
});
