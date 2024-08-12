const message = "Customer for ID '&1' does not exist";

class UnexistingCustomerError extends Error {
  constructor(id) {
    super(message.replace("&1", id));
  }
}

module.exports = UnexistingCustomerError;
