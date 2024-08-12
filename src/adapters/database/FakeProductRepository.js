const ProductDTO = require("../../core/products/dto/ProductDTO");
class FakeProductRepository {
  #products = [];
  #images = [];

  async create(product) {
    const { name, category, description, price, images } = product;

    const createdProduct = {
      id: this.#products.length + 1,
      name,
      category,
      description,
      price,
      images: []
    };

    this.#products.push(createdProduct);
    this.#addImages({ productId: createdProduct.id, images });

    createdProduct.images.push(...this.#images);

    return this.#createProductDTO(createdProduct);
  }

  async findAll() {
    const products = await this.#findProductWithImage(this.#products);
    return Promise.resolve(products?.map(this.#createProductDTO));
  }

  async findById(id) {
    const product = this.#products.find((product) => product?.id === id);
    const images = this.#images.filter((image) => image?.productId === id);

    if (images?.length > 0) product.images = images;

    return Promise.resolve(
      product ? this.#createProductDTO(product) : undefined
    );
  }

  async findByCategory(category) {
    const productsByCategory = this.#products.filter(
      (product) => product?.category === category
    );

    const products = this.#findProductWithImage(productsByCategory);

    return Promise.resolve(products?.map(this.#createProductDTO));
  }

  update(product) {
    const productIndex = this.#products.findIndex(
      (persistedProduct) => persistedProduct?.id === product.id
    );

    this.#products[productIndex].name = product.name;
    this.#products[productIndex].category = product.category;
    this.#products[productIndex].description = product.description;
    this.#products[productIndex].price = product.price;

    this.#deleteImages(product.id);
    this.#products[productIndex].images = this.#addImages({
      productId: product.id,
      images: product?.images
    });

    return this.#createProductDTO(this.#products[productIndex]);
  }

  delete(id) {
    const productIndex = this.#products.findIndex(
      (product) => product?.id === id
    );
    delete this.#products[productIndex];
    return Promise.resolve();
  }

  #findProductWithImage(products) {
    return products.map((product) => {
      const images = this.#images.filter(
        (image) => image?.productId === product.id
      );
      if (images?.length > 0) product.images = images;
      return product;
    });
  }

  #addImages({ productId, images }) {
    if (!images || images?.length === 0) return;

    return images?.map((image) => {
      image.id = this.#images?.length + 1;
      image.productId = productId;
      this.#images.push(image);
    });
  }

  #deleteImages(productId) {
    this.#images = this.#images.filter(
      (image) => image?.productId !== productId
    );
  }

  #createProductDTO(values) {
    return new ProductDTO({
      id: values.id,
      name: values.name,
      category: values.category,
      description: values.description,
      price: values.price,
      images: values.images
    });
  }
}

module.exports = FakeProductRepository;
