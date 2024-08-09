const message = "CPF '&1' provided is already registered";

class ExistentCustomerError extends Error {
  constructor(cpf) {
    super(message.replace("&1", cpf));
  }
}

module.exports = ExistentCustomerError;
