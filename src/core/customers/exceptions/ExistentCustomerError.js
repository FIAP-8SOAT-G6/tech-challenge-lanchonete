const message = "CPF '&1' provided is already registered";

class ExistentCustomerError extends Error {
  constructor(id) {
    super(message.replace('&1', id));
  }
}

module.exports = ExistentCustomerError;
