const message = "Product for ID '&1' does not exist";

class UnexistingProductError extends Error {
  constructor(id) {
    super(message.replace("&1", id));
  }
}

module.exports = UnexistingProductError;
