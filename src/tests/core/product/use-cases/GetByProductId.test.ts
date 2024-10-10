import ProductCategory from "../../../../core/products/entities/ProductCategory";
import FakeProductGateway from "../../../../gateways/FakeProductGateway";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import ProductDTO from "../../../../core/products/dto/ProductDTO";
import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";
import CreateProductUseCase from "../../../../core/products/use-cases/CreateProduct";
import GetByProductIdUseCase from "../../../../core/products/use-cases/GetByProductId";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Get By Product Id", () => {
  const repository = new FakeProductGateway();

  function setupCreateUseCase() {
    return new CreateProductUseCase(repository);
  }

  function setupProductUseCase() {
    return new GetByProductIdUseCase(repository);
  }

  it("should return the Product if given id", async () => {
    const createUseCase = setupCreateUseCase();
    const productUseCase = setupProductUseCase();

    const productDTO = new ProductDTO({
      name: "Hamburguer",
      category: ProductCategory.Lanche,
      description: "Big Hamburguer",
      price: 12.0,
      images: [{ url: "image1" }, { url: "image2" }]
    });

    const product = await createUseCase.createProduct(productDTO);
    const foundProduct = await productUseCase.getByProductId(product.id!);

    expect(foundProduct).to.not.be.undefined;
    expect(product.images!.length).to.be.equal(2);
  });

  it("should return error if no Product exists for ID", async () => {
    const productUseCase = setupProductUseCase();
    const unexistingId = 15;

    await expect(productUseCase.getByProductId(unexistingId)).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });
});
