import ProductDTO from "../core/products/dto/ProductDTO";
import ProductGateway from "../core/interfaces/ProductGateway";

type FakeProduct = {
  id: number;
  name?: string;
  category?: string;
  description?: string;
  price?: number;
};

export default class FakeProductGateway implements ProductGateway {
  private products: FakeProduct[] = [];

  async createProduct(productDTO: ProductDTO): Promise<ProductDTO> {
    const { name, category, description, price } = productDTO;

    const createdProduct = {
      id: this.products.length + 1,
      name,
      category,
      description,
      price,
    };

    this.products.push(createdProduct);

    return this.#createProductDTO(createdProduct);
  }

  async getByProductId(id: number): Promise<ProductDTO | undefined> {
    const product = this.products.find((product) => product?.id === id);
    return Promise.resolve(
      product ? this.#createProductDTO(product) : undefined
    );
  }

  #createProductDTO(databaseProduct: FakeProduct) {
    return new ProductDTO({
      id: databaseProduct.id,
      name: databaseProduct.name,
      category: databaseProduct.category,
      description: databaseProduct.description,
      price: databaseProduct.price,
    });
  }
}
