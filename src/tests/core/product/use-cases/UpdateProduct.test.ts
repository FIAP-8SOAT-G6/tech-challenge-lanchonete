import ProductCategory from "../../../../core/products/entities/ProductCategory";
import FakeProductGateway from "../../../../gateways/FakeProductGateway";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import ProductDTO from "../../../../core/products/dto/ProductDTO";
import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";
import CreateProductUseCase from "../../../../core/products/use-cases/CreateProduct";
import GetByProductIdUseCase from "../../../../core/products/use-cases/GetByProductId";
import UpdateProductUseCase from "../../../../core/products/use-cases/UpdateProduct";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Update Product", () => {
  const repository = new FakeProductGateway();
  function setupCreateUseCase() {
    return new CreateProductUseCase(repository);
  }

  function setupProductUseCase() {
    return new GetByProductIdUseCase(repository);
  }

  function setupUpdatetUseCase() {
    return new UpdateProductUseCase(repository);
  }

  it("should update only product fields", async () => {
    const createUseCase = setupCreateUseCase();
    const productUseCase = setupProductUseCase();
    const updateUseCase = setupUpdatetUseCase();

    const productDTO = new ProductDTO({
      name: "Hamburguer",
      category: ProductCategory.Lanche,
      description: "Big Hamburguer",
      price: 10.0
    });
    const createdProductDTO = await createUseCase.createProduct(productDTO);

    const updateProductDTO = new ProductDTO({
      id: createdProductDTO.id!,
      name: "French Fries",
      description: "This should actually be some French Fries",
      category: ProductCategory.Acompanhamento,
      price: 12.0
    });

    await updateUseCase.updateProduct(updateProductDTO);

    const foundProductDTO = await productUseCase.getByProductId(updateProductDTO.id!);
    expect(foundProductDTO).to.not.be.undefined;
    expect(foundProductDTO.name).to.be.equals("French Fries");
    expect(foundProductDTO.category).to.be.equals(ProductCategory.Acompanhamento);
    expect(foundProductDTO.description).to.be.equals("This should actually be some French Fries");
    expect(foundProductDTO.price).to.be.equals(12.0);
  });

  it("should delete actual images and add new images in product when updated", async () => {
    const createUseCase = setupCreateUseCase();
    const productUseCase = setupProductUseCase();
    const updateUseCase = setupUpdatetUseCase();

    const productDTO = new ProductDTO({
      name: "Hamburguer",
      category: ProductCategory.Lanche,
      description: "Big Hamburguer",
      price: 10.0,
      images: [{ url: "image1" }, { url: "image2" }]
    });
    const createdProductDTO = await createUseCase.createProduct(productDTO);

    const updateProductDTO = new ProductDTO({
      id: createdProductDTO.id!,
      name: "French Fries",
      description: "This should actually be some French Fries",
      category: ProductCategory.Acompanhamento,
      price: 12.0,
      images: [{ url: "image3" }]
    });

    await updateUseCase.updateProduct(updateProductDTO);

    const foundProductDTO = await productUseCase.getByProductId(updateProductDTO.id!);
    expect(foundProductDTO).to.not.be.undefined;
    expect(foundProductDTO.name).to.be.equals("French Fries");
    expect(foundProductDTO.category).to.be.equals(ProductCategory.Acompanhamento);
    expect(foundProductDTO.description).to.be.equals("This should actually be some French Fries");
    expect(foundProductDTO.price).to.be.equals(12.0);
    expect(foundProductDTO.images!.length).to.be.equals(1);
  });

  it("should remove images when the updated product has no images", async () => {
    const createUseCase = setupCreateUseCase();
    const productUseCase = setupProductUseCase();
    const updateUseCase = setupUpdatetUseCase();

    const productDTO = new ProductDTO({
      name: "Hamburguer",
      category: ProductCategory.Lanche,
      description: "Big Hamburguer",
      price: 10.0,
      images: [{ url: "image1" }, { url: "image2" }]
    });
    const createdProductDTO = await createUseCase.createProduct(productDTO);

    const updateProductDTO = new ProductDTO({
      id: createdProductDTO.id!,
      name: "French Fries",
      description: "This should actually be some French Fries",
      category: ProductCategory.Acompanhamento,
      price: 12.0
    });

    await updateUseCase.updateProduct(updateProductDTO);

    const foundProductDTO = await productUseCase.getByProductId(updateProductDTO.id!);
    expect(foundProductDTO).to.not.be.undefined;
    expect(foundProductDTO.name).to.be.equals("French Fries");
    expect(foundProductDTO.category).to.be.equals(ProductCategory.Acompanhamento);
    expect(foundProductDTO.description).to.be.equals("This should actually be some French Fries");
    expect(foundProductDTO.price).to.be.equals(12.0);
    expect(foundProductDTO.images).to.be.deep.equals([]);
  });

  it("should reject if product does not exist", async () => {
    const updateUseCase = setupUpdatetUseCase();
    const unexistingProductDTO = new ProductDTO({
      id: -1,
      description: "Very Big Hamburguer"
    });

    const updatePromise = updateUseCase.updateProduct(unexistingProductDTO);

    await expect(updatePromise).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });
});
