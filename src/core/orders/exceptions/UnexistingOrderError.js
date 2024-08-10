const message = "Order for ID '&1' does not exist";

class UnexistingOrderError extends Error {
  constructor(id) {
    super(message.replace("&1", id));
  }
}

module.exports = UnexistingOrderError;
