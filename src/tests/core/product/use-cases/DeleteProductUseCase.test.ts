import ProductCategory from "../../../../core/products/entities/ProductCategory";
import FakeProductGateway from "../../../../gateways/FakeProductGateway";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";
import CreateProductUseCase from "../../../../core/products/use-cases/CreateProductUseCase";
import GetByProductIdUseCase from "../../../../core/products/use-cases/GetByProductIdUseCase";
import DeleteProductUseCase from "../../../../core/products/use-cases/DeleteProductUseCase";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Delete Product", () => {
  let repository: FakeProductGateway;

  beforeEach(() => {
    repository = new FakeProductGateway();
  });

  function setupCreateUseCase() {
    return new CreateProductUseCase(repository);
  }

  function setupProductUseCase() {
    return new GetByProductIdUseCase(repository);
  }

  function setupDeletetUseCase() {
    return new DeleteProductUseCase(repository);
  }

  it("should delete the Product of given id", async () => {
    const createUseCase = setupCreateUseCase();
    const productUseCase = setupProductUseCase();
    const deleteUseCase = setupDeletetUseCase();

    const productDTO = {
      name: "Hamburguer",
      category: ProductCategory.Lanche,
      description: "Big Hamburguer",
      price: 10.0
    };
    const createdProductDTO = await createUseCase.createProduct(productDTO);

    await deleteUseCase.deleteProduct(createdProductDTO.id!);

    await expect(productUseCase.getByProductId(createdProductDTO.id!)).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it("should throw error when Product does not exist", async () => {
    const deleteUseCase = setupDeletetUseCase();
    const productUseCase = setupProductUseCase();

    const idNonexisting = 12;
    await deleteUseCase.deleteProduct(idNonexisting);

    await expect(productUseCase.getByProductId(idNonexisting)).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });
});
