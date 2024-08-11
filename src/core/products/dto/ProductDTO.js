class ProductDTO {
  constructor({ id, name, category, description, price, images }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.description = description;
    this.price = price;
    this.images = images;
  }
}

module.exports = ProductDTO;
