import InvalidCategoryError from "../exceptions/InvalidCategoryError";
import MissingPropertyError from "../../common/exceptions/MissingPropertyError";
import ProductCategory from "./ProductCategory";

type ProductParams = {
  id?: number;
  name: string;
  category: string;
  description: string;
  price: number;
  images?: { url: string }[];
};

export default class Product {
  private id?: number;
  private name!: string;
  private category!: string;
  private description!: string;
  private price!: number;
  private images!: { url: string }[];

  constructor({ id, name, category, description, price, images }: ProductParams) {
    this.id = id;

    this.setName(name!);
    this.setCategory(category!);
    this.setDescription(description!);
    this.setPrice(price!);
    this.setImages(images!);
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getCategory() {
    return this.category;
  }

  getDescription() {
    return this.description;
  }

  getPrice() {
    return this.price;
  }

  getImages() {
    return this.images;
  }

  setName(name: string) {
    this.validateName(name);
    this.name = name;
  }

  setCategory(category: string) {
    this.validateCategory(category);
    this.category = category;
  }

  setPrice(price: number) {
    this.validatePrice(price);
    this.price = price;
  }

  setDescription(description: string) {
    this.description = description;
  }

  setImages(images: { url: string }[]) {
    this.images = images?.map((url: any) => ({ productId: this.id, url })) || [];
  }

  private validateName(name: string) {
    if (!name) {
      throw new MissingPropertyError("name");
    }
  }

  private validateCategory(category: string) {
    if (!category) {
      throw new MissingPropertyError("category");
    }

    if (!Object.keys(ProductCategory).includes(category)) {
      throw new InvalidCategoryError(category);
    }
  }

  private validatePrice(price: number) {
    if (!price || price < 0) {
      throw new MissingPropertyError("price");
    }
  }
}
