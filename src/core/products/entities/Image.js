class Image {
  constructor({ id, productId, url }) {
    this.id = id;

    this.setProductId(productId);
    this.setUrl(url);
  }

  setProductId(productId) {
    this.productId = productId;
  }

  setUrl(url) {
    this.url = url;
  }

  getAttributes() {
    return {
      id: this.id,
      productId: this.productId,
      url: this.url
    };
  }
}

module.exports = Image;
