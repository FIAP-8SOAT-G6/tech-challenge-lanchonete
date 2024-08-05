const message = "Customer for CPF '&1' does not exist.";

class NonexistentCustomerError extends Error {
  constructor({ cpf }) {
    super(message.replace("&1", cpf));
  }
}

module.exports = NonexistentCustomerError;
