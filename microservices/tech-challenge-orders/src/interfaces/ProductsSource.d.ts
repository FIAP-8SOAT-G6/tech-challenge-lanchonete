export interface ProductsSource {
  findById(id: number): Promise<ProductDTO | undefined>;
}
