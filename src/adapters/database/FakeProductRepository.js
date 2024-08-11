const ProductDTO = require("../../core/products/dto/ProductDTO");
//const Image = require("../../core/products/entities/Image");
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

    return Promise.resolve(this.#createProductDTO(createdProduct));
  }

  async findAll() {
    return Promise.resolve(this.#products.map(this.#createProductDTO));
  }

  async findById(id) {
    const product = this.#products.find((product) => product?.id === id);
    return Promise.resolve(
      product ? this.#createProductDTO(product) : undefined
    );
  }

  async findByCategory(category) {
    const products = this.#products.filter(
      (product) => product?.category === category
    );
    return Promise.resolve(products.map(this.#createProductDTO));
  }

  #addImages({ productId, images }) {
    images?.map((image) => {
      image.id = this.#images?.length + 1;
      image.productId = productId;
      this.#images.push(image);
    });
  }

  update(product) {
    const productIndex = this.#products.findIndex(
      (persistedProduct) => persistedProduct?.id === product.id
    );

    this.#products[productIndex].name = product.name;
    this.#products[productIndex].category = product.category;
    this.#products[productIndex].description = product.description;
    this.#products[productIndex].price = product.price;
    this.#products[productIndex].images = product.images;

    return this.#createProductDTO(this.#products[productIndex]);
  }

  delete(id) {
    const productIndex = this.#products.findIndex(
      (product) => product?.id === id
    );
    delete this.#products[productIndex];
    return Promise.resolve();
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
