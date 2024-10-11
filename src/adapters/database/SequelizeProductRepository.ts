import ProductDTO from "../../core/products/dto/ProductDTO";
import ProductRepository from "../../core/ports/ProductRepository";

import SequelizeProduct from "../../infrastructure/database/models/product";
import SequelizeImage from "../../infrastructure/database/models/image";

export default class SequelizeProductRepository implements ProductRepository {
  async create(productDTO: ProductDTO): Promise<ProductDTO> {
    const { name, category, description, price, images } = productDTO as Required<ProductDTO>;
    const createdProduct = await SequelizeProduct.create({
      name,
      category,
      description,
      price
    });

    createdProduct.images = await this.#addImages({
      productId: createdProduct.id
    });

    return this.#createProductDTO(createdProduct);
  }

  async findAll() {
    const products = await this.#findAllProducts({});
    return products ? products?.map(this.#createProductDTO) : [];
  }

  async findById(id: number): Promise<ProductDTO | undefined> {
    const product = await SequelizeProduct.findByPk(id);
    const images = await this.#findImagesByProductId(id);
    if (product && images?.length > 0) product.images = images;
    return product ? this.#createProductDTO(product) : undefined;
  }

  async findByCategory(category: string): Promise<ProductDTO[]> {
    const products = await this.#findAllProducts({ where: { category } });

    return products ? products?.map(this.#createProductDTO) : [];
  }

  async #findAllProducts(conditions?: any): Promise<ProductDTO[]> {
    const products = await SequelizeProduct.findAll(conditions);

    return await Promise.all(
      products.map(async (product: any) => {
        const images = await this.#findImagesByProductId(product.id);
        if (images?.length > 0) product.images = images;

        return product;
      })
    );
  }

  async #findImagesByProductId(productId: number): Promise<SequelizeImage[]> {
    const images = await SequelizeImage.findAll({
      where: { ProductId: productId }
    });
    return images;
  }

  async update(productDTO: ProductDTO): Promise<ProductDTO | undefined> {
    const dbProduct = await SequelizeProduct.findByPk(productDTO.id);
    if (dbProduct) {
      const updatedProduct = await dbProduct.update({
        name: productDTO.name,
        category: productDTO.category,
        description: productDTO.description,
        price: productDTO.price
      });

      await this.#deleteImages(productDTO.id!);

      updatedProduct.images = await this.#addImages({
        productId: productDTO.id!,
        images: productDTO?.images
      });
      return this.#createProductDTO(updatedProduct);
    }
  }

  async delete(id: number) {
    const product = await SequelizeProduct.findByPk(id);
    if (!product) return;
    await product.destroy();
    await this.#deleteImages(id);
  }

  async #addImages({ productId, images }: { productId: number; images?: { url: string }[] }): Promise<SequelizeImage[] | undefined> {
    if (!images) return;

    const newImages = await Promise.all(
      images.map((image) =>
        SequelizeImage.create({
          ProductId: productId,
          url: image.url
        })
      )
    );

    return newImages;
  }

  async #deleteImages(productId: number): Promise<undefined> {
    const dbImages = await SequelizeImage.findAll({
      where: { ProductId: productId }
    });

    if (dbImages.length > 0) {
      for (const image of dbImages) {
        await image.destroy();
      }
    }
  }

  #createProductDTO(values: any) {
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
