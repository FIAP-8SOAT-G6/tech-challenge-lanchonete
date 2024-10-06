import ProductRepository from "../../core/ports/ProductRepository";
import ProductDTO from "../../core/products/dto/ProductDTO";

type FakeProduct = {
  id: number;
  name?: string;
  category?: string;
  description?: string;
  price?: number;
  images: FakeImage[];
};

type FakeImage = {
  id: number;
  productId: number;
  url: string;
};

export default class FakeProductRepository implements ProductRepository {
  private products: FakeProduct[] = [];
  private images: FakeImage[] = [];

  async create(productDTO: ProductDTO): Promise<ProductDTO> {
    const { name, category, description, price, images } = productDTO;

    const createdProduct = {
      id: this.products.length + 1,
      name,
      category,
      description,
      price,
      images: [] as FakeImage[]
    };

    this.products.push(createdProduct);
    this.#addImages({ productId: createdProduct.id, images: images as FakeImage[] });

    createdProduct.images.push(...this.images);

    return this.#createProductDTO(createdProduct);
  }

  async findAll(): Promise<ProductDTO[]> {
    const products = await this.#findProductWithImage(this.products);
    return Promise.resolve(products?.map(this.#createProductDTO));
  }

  async findById(id: number): Promise<ProductDTO | undefined> {
    const product = this.products.find((product) => product?.id === id);
    const images = this.images.filter((image) => image?.productId === id);

    if (images?.length > 0) product!.images = images;

    return Promise.resolve(
      product ? this.#createProductDTO(product) : undefined
    );
  }

  async findByCategory(category: string): Promise<ProductDTO[]> {
    const productsByCategory = this.products.filter(
      (product) => product?.category === category
    );

    const products = this.#findProductWithImage(productsByCategory);

    return Promise.resolve(products?.map(this.#createProductDTO));
  }

  update(productDTO: ProductDTO): Promise<ProductDTO> {
    const productIndex = this.products.findIndex(
      (persistedProduct) => persistedProduct?.id === productDTO.id
    );

    this.products[productIndex].name = productDTO.name;
    this.products[productIndex].category = productDTO.category;
    this.products[productIndex].description = productDTO.description;
    this.products[productIndex].price = productDTO.price;

    this.#deleteImages(productDTO.id!);
    this.products[productIndex].images = this.#addImages({
      productId: productDTO.id!,
      images: productDTO?.images as FakeImage[]
    });

    return Promise.resolve(this.#createProductDTO(this.products[productIndex]));
  }

  delete(id: number) {
    const productIndex = this.products.findIndex(
      (product) => product?.id === id
    );
    delete this.products[productIndex];
    return Promise.resolve();
  }

  #findProductWithImage(products: FakeProduct[]) {
    return products.map((product) => {
      const images = this.images.filter(
        (image) => image?.productId === product.id
      );
      if (images?.length > 0) product.images = images;
      return product;
    });
  }

  #addImages({
    productId,
    images
  }: {
    productId: number;
    images?: FakeImage[];
  }): FakeImage[] {
    if (!images || images?.length === 0) return [];

    images?.forEach((image) => {
      image.id = this.images?.length + 1;
      image.productId = productId;
      this.images.push(image);
    });

    return images;
  }

  #deleteImages(productId: number) {
    this.images = this.images.filter((image) => image?.productId !== productId);
  }

  #createProductDTO(databaseProduct: FakeProduct) {
    return new ProductDTO({
      id: databaseProduct.id,
      name: databaseProduct.name,
      category: databaseProduct.category,
      description: databaseProduct.description,
      price: databaseProduct.price,
      images: databaseProduct.images
    });
  }
}


