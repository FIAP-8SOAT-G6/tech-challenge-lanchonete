import ProductCategory from "../../../../core/products/entities/ProductCategory";
import FakeProductGateway from "../../../../gateways/FakeProductGateway";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import ProductDTO from "../../../../core/products/dto/ProductDTO";
import CreateProductUseCase from "../../../../core/products/use-cases/CreateProductUseCase";
import GetAllProductUseCase from "../../../../core/products/use-cases/GetAllProductUseCase";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Get All Products", () => {
  let repository: FakeProductGateway;

  beforeEach(() => {
    repository = new FakeProductGateway();
  });

  function setupCreateUseCase() {
    return new CreateProductUseCase(repository);
  }

  function setupProductUseCase() {
    return new GetAllProductUseCase(repository);
  }

  it("should return empty list when there are no Products", async () => {
    const productUseCase = setupProductUseCase();
    const products = await productUseCase.getAllProducts();

    expect(products).not.to.be.undefined;
    expect(products.length).to.be.equal(0);
  });

  it("should return all Products", async () => {
    const createUseCase = setupCreateUseCase();
    const productUseCase = setupProductUseCase();
    await Promise.all([
      createUseCase.createProduct(
        new ProductDTO({
          name: "Hamburguer",
          category: ProductCategory.Lanche,
          description: "Big Hamburguer",
          price: 10.0,
          images: [{ url: "image1" }]
        })
      ),
      createUseCase.createProduct(
        new ProductDTO({
          name: "French Fries",
          category: ProductCategory.Acompanhamento,
          description: "250g of French Fries",
          price: 6.0,
          images: []
        })
      )
    ]);

    const products = await productUseCase.getAllProducts();

    expect(products).to.not.be.undefined;
    expect(products?.length).to.be.at.least(2);
  });

  it("should return all Products with images", async () => {
    const createUseCase = setupCreateUseCase();
    const productUseCase = setupProductUseCase();
    await Promise.all([
      createUseCase.createProduct(
        new ProductDTO({
          name: "Hamburguer",
          category: ProductCategory.Lanche,
          description: "Big Hamburguer",
          price: 10.0,
          images: [{ url: "image1" }]
        })
      ),
      createUseCase.createProduct(
        new ProductDTO({
          name: "French Fries",
          category: ProductCategory.Acompanhamento,
          description: "250g of French Fries",
          price: 6.0,
          images: [{ url: "image1" }, { url: "image2" }]
        })
      )
    ]);

    const products = (await productUseCase.getAllProducts()) || [];

    expect(products[0].images!.length).to.be.equals(1);
    expect(products[1].images!.length).to.be.equals(2);
  });
});
