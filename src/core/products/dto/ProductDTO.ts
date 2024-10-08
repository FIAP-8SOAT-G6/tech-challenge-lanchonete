export default class ProductDTO {
  public id?: number;
  public name?: string;
  public category?: string;
  public description?: string;
  public price?: number;
  public images?: { url: string }[];

  constructor({
    id,
    name,
    category,
    description,
    price,
    images
  }: {
    id?: number;
    name?: string;
    category?: string;
    description?: string;
    price?: number;
    images?: { url: string }[];
  }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.description = description;
    this.price = Number(price);
    this.images = images;
  }
}


