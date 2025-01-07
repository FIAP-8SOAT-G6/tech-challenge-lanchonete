import ProductCategory from "../../../../core/products/entities/ProductCategory";
import InvalidCategoryError from "../../../../core/products/exceptions/InvalidCategoryError";
import FakeProductGateway from "../../../../gateways/FakeProductGateway";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import ProductDTO from "../../../../core/products/dto/ProductDTO";
import CreateProductUseCase from "../../../../core/products/use-cases/CreateProductUseCase";
import GetByCategoryUseCase from "../../../../core/products/use-cases/GetByCategoryUseCase";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Get By Category", () => {
  let repository: FakeProductGateway;

  beforeEach(() => {
    repository = new FakeProductGateway();
  });

  function setupCreateUseCase() {
    return new CreateProductUseCase(repository);
  }

  function setupProductUseCase() {
    return new GetByCategoryUseCase(repository);
  }

  it("should return empty list when there are no Product by Category", async () => {
    const productUseCase = setupProductUseCase();
    const products = await productUseCase.getByCategory(ProductCategory.Lanche);

    expect(products).not.to.be.undefined;
    expect(products.length).to.be.equal(0);
  });

  it("should return all Products of given category", async () => {
    const createUseCase = setupCreateUseCase();
    const productUseCase = setupProductUseCase();
    await Promise.all([
      createUseCase.createProduct(
        new ProductDTO({
          name: "Hamburguer",
          category: ProductCategory.Lanche,
          description: "Big Hamburguer",
          price: 10.0
        })
      ),
      createUseCase.createProduct(
        new ProductDTO({
          name: "Hot-Dog",
          category: ProductCategory.Lanche,
          description: "Classic New York Hot Dog",
          price: 10.0
        })
      ),
      createUseCase.createProduct(
        new ProductDTO({
          name: "French Fries",
          category: ProductCategory.Acompanhamento,
          description: "250g of French Fries",
          price: 10.0
        })
      )
    ]);

    const products = await productUseCase.getByCategory(ProductCategory.Lanche);

    expect(products).to.not.be.undefined;
    expect(products?.length).to.be.equals(2);
    products?.forEach((product) => expect(product.category).to.be.equal(ProductCategory.Lanche));
  });

  it("should return all Products of given category with images", async () => {
    const createUseCase = setupCreateUseCase();
    const productUseCase = setupProductUseCase();

    await Promise.all([
      createUseCase.createProduct(
        new ProductDTO({
          name: "Hamburguer",
          category: ProductCategory.Lanche,
          description: "Big Hamburguer",
          price: 10.0,
          images: [{ url: "image1" }, { url: "image2" }]
        })
      ),
      createUseCase.createProduct(
        new ProductDTO({
          name: "Hot-Dog",
          category: ProductCategory.Lanche,
          description: "Classic New York Hot Dog",
          price: 10.0,
          images: [{ url: "image1" }, { url: "image2" }, { url: "image3" }]
        })
      )
    ]);

    const products = (await productUseCase.getByCategory(ProductCategory.Lanche)) || [];

    expect(products[0].images!.length).to.be.equals(2);
    expect(products[1].images!.length).to.be.equals(3);
  });

  it("should reject if invalid category is passed", async () => {
    const productUseCase = setupProductUseCase();
    const invalidCategory = "UNEXISTING_CATEGORY";

    await expect(productUseCase.getByCategory(invalidCategory)).to.be.eventually.rejectedWith(new InvalidCategoryError(invalidCategory).message);
  });
});
