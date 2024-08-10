class ProductDTO {
  constructor({ id, name, category, description, price }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.description = description;
    this.price = price;
  }
}

module.exports = ProductDTO;
