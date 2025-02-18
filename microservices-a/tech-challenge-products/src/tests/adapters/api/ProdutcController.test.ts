import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import request from "supertest";
import app from "../../../../src/server";
import SequelizeProductDataSource from "../../../external/SequelizeProductDataSource";
import ResourceNotFoundError from "../../../core/common/exceptions/ResourceNotFoundError";
import sinon from "sinon";
import MissingPropertyError from "../../../core/common/exceptions/MissingPropertyError";
import ProductDTO from "../../../core/products/dto/ProductDTO";
import ProductCategory from "../../../core/products/entities/ProductCategory";
import InvalidCategoryError from "../../../core/products/exceptions/InvalidCategoryError";

chai.use(chaiAsPromised);

describe("Product Controller", () => {
  let createStub: sinon.SinonStub;
  let findAllStub: sinon.SinonStub;
  let findByIdStub: sinon.SinonStub;
  let findByCategoryStub: sinon.SinonStub;
  let updateStub: sinon.SinonStub;
  let deleteStub: sinon.SinonStub;

  function buildProduct(customProps = {}) {
    return {
      name: "Product",
      category: ProductCategory.Acompanhamento,
      description: "Description",
      price: 10,
      ...customProps,
    };
  }

  beforeEach(() => {
    createStub = sinon.stub(SequelizeProductDataSource.prototype, "create");
    findAllStub = sinon.stub(SequelizeProductDataSource.prototype, "findAll");
    findByIdStub = sinon.stub(SequelizeProductDataSource.prototype, "findById");
    findByCategoryStub = sinon.stub(
      SequelizeProductDataSource.prototype,
      "findByCategory"
    );
    updateStub = sinon.stub(SequelizeProductDataSource.prototype, "update");
    deleteStub = sinon.stub(SequelizeProductDataSource.prototype, "delete");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("create product", () => {
    it("should return the product created when create an product with success", async () => {
      const product = buildProduct();
      const productDTO = new ProductDTO(product);
      const productCreated = { ...product, id: "1" };
      createStub.resolves(productCreated);

      const res = await request(app).post("/products").send(product);

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal(productCreated);
      expect(createStub.calledOnce).to.be.true;
      expect(createStub.calledOnceWith(productDTO)).to.be.true;
    });

    it("should created the product with images", async () => {
      const product = buildProduct();
      const productDTO = new ProductDTO(product);
      const productCreated = { ...product, id: "1" };
      createStub.resolves(productCreated);

      const res = await request(app).post("/products").send(product);

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal(productCreated);
      expect(createStub.calledOnce).to.be.true;
      expect(createStub.calledOnceWith(productDTO)).to.be.true;
    });

    it("should return an error message when there are no parameters to create the product", async () => {
      const product = buildProduct({ name: "" });
      const productCreated = { ...product, id: "1" };
      createStub.resolves(productCreated);

      const res = await request(app).post("/products").send(product);

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        error: new MissingPropertyError("name").message,
      });
      expect(createStub.calledOnce).to.be.false;
    });

    it("should return an error message when category for given is invalid", async () => {
      const category = "invalid";
      const product = buildProduct({ category });
      const productCreated = { ...product, id: "1" };
      createStub.resolves(productCreated);

      const res = await request(app).post("/products").send(product);

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        error: new InvalidCategoryError(category).message,
      });
      expect(createStub.calledOnce).to.be.false;
    });

    it("should return error message when there is an unhandled error", async () => {
      createStub.rejects();

      const res = await request(app).post("/products").send(buildProduct());

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
      expect(createStub.calledOnce).to.be.true;
    });
  });

  describe("get product by id", () => {
    it("should search a product by id", async () => {
      const product = buildProduct();
      const productCreated = { ...product, id: 1 };
      findByIdStub.resolves(productCreated);

      const res = await request(app).get(`/products/${productCreated.id}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(productCreated);
      expect(findByIdStub.calledWith(productCreated.id)).to.be.true;
    });

    it("should return an error message when the product is not found", async () => {
      findByIdStub.resolves(undefined);

      const id = 1;
      const res = await request(app).get(`/products/${id}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        error: new ResourceNotFoundError("Product", "id", id).message,
      });
      expect(findByIdStub.calledOnce).to.be.true;
      expect(findByIdStub.calledOnceWith(id)).to.be.true;
    });

    it("should return an error message in unhandled cases", async () => {
      findByIdStub.rejects();
      const res = await request(app).get(`/products/1`);

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
      expect(findByIdStub.calledOnce).to.be.true;
    });
  });

  describe("get all products", () => {
    it("should return list with all products", async () => {
      const products = [buildProduct({ id: 1 }), buildProduct({ id: 2 })];
      const productDTOs = products.map((product) => new ProductDTO(product));
      findAllStub.resolves(productDTOs);

      const res = await request(app).get("/products");

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(productDTOs);
      expect(findAllStub.called).to.be.true;
    });

    it("should return empty list when no have products", async () => {
      findAllStub.resolves([]);
      const res = await request(app).get("/products");

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal([]);
      expect(findAllStub.calledOnce).to.be.true;
    });

    it("should return an error message in unhandled cases", async () => {
      findAllStub.rejects();
      const res = await request(app).get(`/products`);

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
      expect(findAllStub.calledOnce).to.be.true;
    });
  });

  describe("get products by category", () => {
    it("should return list by category", async () => {
      const products = [
        buildProduct({ id: 1 }),
        buildProduct({ id: 2, category: ProductCategory.Bebida }),
        buildProduct({ id: 3, category: ProductCategory.Bebida }),
      ];
      const productDTOs = products.map((product) => new ProductDTO(product));
      const productDTOsFiltered = productDTOs.filter(
        (product) => product.category === ProductCategory.Bebida
      );
      findByCategoryStub.resolves(productDTOsFiltered);

      const res = await request(app).get(
        `/category/${ProductCategory.Bebida}/products`
      );

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(productDTOsFiltered);
      expect(findByCategoryStub.called).to.be.true;
    });

    it("should return empty list when no have products in category for given", async () => {
      findByCategoryStub.resolves([]);
      const res = await request(app).get(
        `/category/${ProductCategory.Acompanhamento}/products`
      );

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal([]);
      expect(findByCategoryStub.calledOnce).to.be.true;
    });

    it("should return error message when category for given is invalid", async () => {
      const someCategory = "some_category";
      const res = await request(app).get(`/category/${someCategory}/products`);

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        error: new InvalidCategoryError(someCategory).message,
      });
      expect(findByCategoryStub.calledOnce).to.be.false;
    });

    it("should return an error message in unhandled cases", async () => {
      findByCategoryStub.rejects();
      const res = await request(app).get(
        `/category/${ProductCategory.Acompanhamento}/products`
      );

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
      expect(findByCategoryStub.calledOnce).to.be.true;
    });
  });

  describe("update product", () => {
    it("should update product with props given", async () => {
      findByIdStub.resolves(buildProduct({ id: 1 }));
      const product = buildProduct({ name: "Product Updated" });
      const id = 1;
      const productUpdated = { ...product, id, name: "Product Updated" };
      updateStub.resolves(productUpdated);

      const res = await request(app).put(`/products/${id}`).send(product);

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal(productUpdated);
      expect(updateStub.calledOnce).to.be.true;
    });

    it("should return an error message when product have missing props", async () => {
      findByIdStub.resolves(buildProduct({ id: 1 }));
      const product = buildProduct({ name: "" });
      const res = await request(app).put(`/products/1`).send(product);

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        error: new MissingPropertyError("name").message,
      });
      expect(updateStub.calledOnce).to.be.false;
    });

    it("should return an error message when category for given is invalid", async () => {
      findByIdStub.resolves(buildProduct({ id: 1 }));
      const category = "invalid";
      const product = buildProduct({ category });
      const res = await request(app).put(`/products/1`).send(product);

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        error: new InvalidCategoryError(category).message,
      });
      expect(updateStub.calledOnce).to.be.false;
    });

    it("should return an error message when product for given not exists", async () => {
      const res = await request(app).put(`/products/1`).send(buildProduct());

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        error: new ResourceNotFoundError(
          ResourceNotFoundError.Resources.Product,
          "id",
          1
        ).message,
      });
      expect(updateStub.calledOnce).to.be.false;
    });

    it("should return an error message in unhandled cases", async () => {
      findByIdStub.resolves(buildProduct({ id: 1 }));
      updateStub.rejects();

      const res = await request(app).put(`/products/1`).send(buildProduct());

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
      expect(updateStub.calledOnce).to.be.true;
    });
  });

  describe("delete product", () => {
    it("should delete a product", async () => {
      const id = 1;
      const product = buildProduct({ id });
      const productDTO = new ProductDTO(product);
      deleteStub.resolves(productDTO);

      const res = await request(app).delete(`/products/${id}}`);

      expect(res.status).to.equal(204);
      expect(res.body).to.deep.equal({});
      expect(deleteStub.called).to.be.true;
    });

    it("should return an error message in unhandled cases", async () => {
      deleteStub.rejects();
      const res = await request(app).delete(`/products/1`);

      expect(res.status).to.equal(500);
      expect(res.body).to.deep.equal({ error: "Error" });
      expect(deleteStub.calledOnce).to.be.true;
    });
  });

  describe("route validations", () => {
    it("should return error message of Route not found when route is invalid", async () => {
      const res = await request(app).get("/product/123");

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({ error: "Route not found" });
      expect(findByIdStub.called).to.be.false;
      expect(createStub.called).to.be.false;
    });
  });
});
