import ProductCategory from "../../../../core/products/entities/ProductCategory";
import FakeProductGateway from "../../../../gateways/FakeProductGateway";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import ProductDTO from "../../../../core/products/dto/ProductDTO";
import CreateProductUseCase from "../../../../core/products/use-cases/CreateProduct";
chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Create product", () => {
  const repository = new FakeProductGateway();

  function setupCreateUseCase() {
    return new CreateProductUseCase(repository);
  }

  it("should create a Product with an id", async () => {
    const productUseCase = setupCreateUseCase();
    const productDTO = new ProductDTO({
      name: "Hamburguer",
      category: ProductCategory.Lanche,
      description: "Big Hamburguer",
      price: 12.0,
      images: [{ url: "image1" }, { url: "image2" }]
    });

    const product = await productUseCase.createProduct(productDTO);

    expect(product).to.not.be.undefined;
    expect(product.id!).to.be.equal(1);
  });
});
