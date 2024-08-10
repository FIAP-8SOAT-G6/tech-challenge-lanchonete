const message = "Item for ID '&1' does not exist";

class UnexistingItemError extends Error {
  constructor(id) {
    super(message.replace("&1", id));
  }
}

module.exports = UnexistingItemError;
