import ProductDTO from "../core/products/dto/ProductDTO";

export type ProductResponse = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  images: { url: string }[];
};

export default class ProductPresenter {
  public static adaptProductData(product: ProductDTO | undefined): ProductResponse {
    if (!product) return {} as ProductResponse;
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      images: product.images?.map((image) => ({ url: image.url }))
    } as ProductResponse;
  }

  public static adaptProductsData(products: ProductDTO[] | undefined): ProductResponse[] {
    if (!products) return [];
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      images: product.images?.map((image) => ({ url: image.url }))
    })) as ProductResponse[];
  }
}
