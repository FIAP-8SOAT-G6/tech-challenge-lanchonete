import ProductDTO from "../core/products/dto/ProductDTO";

export default class ProductPresenter {
  public static adaptProductData(product: ProductDTO | undefined): string {
    if (!product) return JSON.stringify({});
    return JSON.stringify({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      images: product.images?.map((image) => ({ url: image.url }))
    });
  }

  public static adaptProductsData(products: ProductDTO[] | undefined): string {
    if (!products) return JSON.stringify({});
    return JSON.stringify(
      products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        images: product.images?.map((image) => ({ url: image.url }))
      }))
    );
  }
}
