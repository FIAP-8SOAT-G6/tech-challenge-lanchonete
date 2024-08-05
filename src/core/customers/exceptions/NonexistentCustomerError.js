const message = "Customer for CPF '&1' does not exist.";

class NonexistentCustomerError extends Error {
  constructor(id) {
    super(message.replace('&1', id));
  }
}

module.exports = NonexistentCustomerError;
