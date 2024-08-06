const message = "CPF '&1' provided is invalid";

class InvalidCPFError extends Error {
  constructor({ cpf }) {
    super(message.replace("&1", cpf));
  }
}

module.exports = InvalidCPFError;
