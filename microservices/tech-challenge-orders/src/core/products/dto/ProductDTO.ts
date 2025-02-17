export default class ProductDTO {
    public id?: number;
    public name?: string;
    public category?: string;
    public description?: string;
    public price?: number;
  
    constructor({
      id,
      name,
      category,
      description,
      price,
    }: {
      id?: number;
      name?: string;
      category?: string;
      description?: string;
      price?: number;
    }) {
      this.id = id;
      this.name = name;
      this.category = category;
      this.description = description;
      this.price = Number(price);
    }
  }
  