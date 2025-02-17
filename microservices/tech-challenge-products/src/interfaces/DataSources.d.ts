import CustomerDTO from "../../core/customers/dto/CustomerDTO";
import ProductDTO from "../core/products/dto/ProductDTO";

type IndexedObject = { [key: string]: any };

export interface ProductDataSource {
  create(productDTO: ProductDTO): Promise<ProductDTO>;

  findAll(): Promise<ProductDTO[] | undefined>;
  findById(id: number): Promise<ProductDTO | undefined>;
  findByCategory(status: string): Promise<ProductDTO[] | []>;

  update(productDTO: ProductDTO): Promise<ProductDTO | undefined>;
  delete(id: number);
}
